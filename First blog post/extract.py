"""
Feed Distortion Index - Extraction Module

Detects which posts the user paused on in a screen recording.
Uses phase correlation (NOT frame differencing) to handle autoplaying video.

This is the EXPENSIVE stage - results are cached to disk.
"""

import cv2
import numpy as np
import json
from pathlib import Path
from dataclasses import dataclass, asdict
from typing import Optional

import config


@dataclass
class DwellEvent:
    """A detected pause on a post."""
    keyframe_path: str
    dwell_time: float  # seconds
    is_video: bool     # True if content was video/animation (not static image)
    frame_index: int   # frame number of keyframe in original video
    start_frame: int   # first frame of dwell
    end_frame: int     # last frame of dwell


@dataclass
class ExtractionResult:
    """Full extraction output, cached to JSON."""
    video_path: str
    dwells: list[dict]
    total_scroll_px: float
    estimated_posts_scrolled: float
    total_frames: int
    video_fps: float
    extraction_fps: float


def extract_keyframes(
    video_path: str,
    output_dir: str = "keyframes",
    debug: bool = False
) -> ExtractionResult:
    """
    Extract keyframes from paused-on posts in a screen recording.

    Args:
        video_path: Path to .mp4 screen recording
        output_dir: Directory to save keyframe images
        debug: If True, print per-frame classification data

    Returns:
        ExtractionResult with detected dwells and scroll stats
    """
    video_path = Path(video_path)
    output_dir = Path(output_dir)
    output_dir.mkdir(exist_ok=True)

    cap = cv2.VideoCapture(str(video_path))
    if not cap.isOpened():
        raise ValueError(f"Cannot open video: {video_path}")

    video_fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    # Calculate frame skip to achieve target motion FPS
    frame_skip = max(1, int(video_fps / config.MOTION_FPS))
    actual_fps = video_fps / frame_skip

    print(f"Video: {frame_width}x{frame_height} @ {video_fps:.1f}fps, {total_frames} frames")
    print(f"Sampling every {frame_skip} frames -> {actual_fps:.1f} fps for motion detection")

    # Calculate ROI bounds
    roi_y0 = config.ROI_Y0
    roi_y1 = frame_height + config.ROI_Y1 if config.ROI_Y1 < 0 else config.ROI_Y1
    print(f"ROI: y=[{roi_y0}, {roi_y1}] (cropping {roi_y0}px top, {frame_height - roi_y1}px bottom)")

    # Create Hanning window for ROI dimensions
    roi_height = roi_y1 - roi_y0
    hanning = cv2.createHanningWindow((frame_width, roi_height), cv2.CV_32F)

    # Storage for frame data
    frame_data = []  # [(frame_idx, dy, peak, classification, gray_roi, full_frame)]
    prev_gray = None

    frame_idx = 0
    sampled_count = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Sample at target FPS
        if frame_idx % frame_skip == 0:
            # Crop to ROI
            roi = frame[roi_y0:roi_y1, :]

            # Convert to grayscale float32
            gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY).astype(np.float32)

            # Apply Hanning window
            gray_windowed = gray * hanning

            if prev_gray is not None:
                # Phase correlation to detect shift
                (dx, dy), response = cv2.phaseCorrelate(prev_gray, gray_windowed)

                # Classify frame
                abs_dy = abs(dy)
                if abs_dy > config.SCROLL_THRESHOLD:
                    classification = "SCROLL"
                elif response > config.STATIC_PEAK_THRESHOLD:
                    classification = "DWELL_STATIC"
                else:
                    classification = "DWELL_VIDEO"

                frame_data.append({
                    "frame_idx": frame_idx,
                    "dy": dy,
                    "peak": response,
                    "classification": classification,
                    "gray_roi": gray.copy(),  # unwindowed for sharpness calc
                    "full_frame": frame.copy(),
                })

                if debug:
                    print(f"Frame {frame_idx:5d}: dy={dy:+7.2f}, peak={response:.3f} -> {classification}")

            prev_gray = gray_windowed
            sampled_count += 1

        frame_idx += 1

    cap.release()
    print(f"Processed {sampled_count} sampled frames")

    # Find dwell runs (maximal sequences of DWELL_* frames)
    dwell_runs = _find_dwell_runs(frame_data, actual_fps)

    if debug:
        print(f"\n=== DETECTED DWELL RUNS (before filtering) ===")
        for i, run in enumerate(dwell_runs):
            print(f"  Run {i}: frames {run['start_idx']}-{run['end_idx']}, "
                  f"duration={run['duration']:.2f}s, is_video={run['is_video']}")

    # Filter by minimum dwell time
    dwell_runs = [r for r in dwell_runs if r["duration"] >= config.MIN_DWELL_TIME]
    print(f"Found {len(dwell_runs)} dwell runs >= {config.MIN_DWELL_TIME}s")

    # Select sharpest keyframe per run
    keyframe_candidates = []
    for run in dwell_runs:
        best_frame = _select_sharpest_frame(run["frames"])
        keyframe_candidates.append({
            "frame_data": best_frame,
            "dwell_time": run["duration"],
            "is_video": run["is_video"],
            "start_frame": run["start_idx"],
            "end_frame": run["end_idx"],
        })

    # Deduplicate with perceptual hashing
    unique_keyframes = _deduplicate_keyframes(keyframe_candidates)
    print(f"After deduplication: {len(unique_keyframes)} unique keyframes")

    # Save keyframes and build result
    dwells = []
    for i, kf in enumerate(unique_keyframes):
        keyframe_path = output_dir / f"keyframe_{i:03d}.jpg"
        cv2.imwrite(str(keyframe_path), kf["frame_data"]["full_frame"])

        dwells.append(DwellEvent(
            keyframe_path=str(keyframe_path),
            dwell_time=kf["dwell_time"],
            is_video=kf["is_video"],
            frame_index=kf["frame_data"]["frame_idx"],
            start_frame=kf["start_frame"],
            end_frame=kf["end_frame"],
        ))

    # Calculate total scroll distance
    total_scroll_px = sum(
        abs(fd["dy"]) for fd in frame_data
        if fd["classification"] == "SCROLL"
    )
    # NOTE: This drifts and is approximate - phase correlation accumulates error
    estimated_posts = total_scroll_px / config.AVG_POST_HEIGHT_PX

    result = ExtractionResult(
        video_path=str(video_path),
        dwells=[asdict(d) for d in dwells],
        total_scroll_px=total_scroll_px,
        estimated_posts_scrolled=estimated_posts,
        total_frames=total_frames,
        video_fps=video_fps,
        extraction_fps=actual_fps,
    )

    # Save to cache
    cache_path = output_dir / "extraction_cache.json"
    with open(cache_path, "w") as f:
        json.dump(asdict(result), f, indent=2)
    print(f"Saved extraction cache to {cache_path}")

    return result


def _find_dwell_runs(frame_data: list[dict], fps: float) -> list[dict]:
    """Find maximal runs of consecutive dwell frames."""
    runs = []
    current_run = None

    for fd in frame_data:
        is_dwell = fd["classification"].startswith("DWELL")

        if is_dwell:
            if current_run is None:
                current_run = {
                    "frames": [fd],
                    "start_idx": fd["frame_idx"],
                    "has_video": fd["classification"] == "DWELL_VIDEO",
                }
            else:
                current_run["frames"].append(fd)
                if fd["classification"] == "DWELL_VIDEO":
                    current_run["has_video"] = True
        else:
            if current_run is not None:
                # End current run
                current_run["end_idx"] = current_run["frames"][-1]["frame_idx"]
                current_run["duration"] = len(current_run["frames"]) / fps
                current_run["is_video"] = current_run["has_video"]
                runs.append(current_run)
                current_run = None

    # Don't forget final run
    if current_run is not None:
        current_run["end_idx"] = current_run["frames"][-1]["frame_idx"]
        current_run["duration"] = len(current_run["frames"]) / fps
        current_run["is_video"] = current_run["has_video"]
        runs.append(current_run)

    return runs


def _select_sharpest_frame(frames: list[dict]) -> dict:
    """Select the frame with highest Laplacian variance (sharpest)."""
    best_frame = None
    best_variance = -1

    for fd in frames:
        # Convert to uint8 for Laplacian (OpenCV doesn't support float32->CV_64F)
        gray_uint8 = fd["gray_roi"].astype(np.uint8)
        laplacian = cv2.Laplacian(gray_uint8, cv2.CV_64F)
        variance = laplacian.var()
        if variance > best_variance:
            best_variance = variance
            best_frame = fd

    return best_frame


def _deduplicate_keyframes(candidates: list[dict]) -> list[dict]:
    """Remove duplicate keyframes using perceptual hashing."""
    if not candidates:
        return []

    # Compute pHash for each candidate
    hasher = cv2.img_hash.PHash_create()

    for kf in candidates:
        gray = cv2.cvtColor(kf["frame_data"]["full_frame"], cv2.COLOR_BGR2GRAY)
        kf["phash"] = hasher.compute(gray)

    # Greedy deduplication: keep first occurrence, skip near-duplicates
    unique = [candidates[0]]

    for kf in candidates[1:]:
        is_duplicate = False
        for existing in unique:
            distance = hasher.compare(kf["phash"], existing["phash"])
            if distance <= config.PHASH_HAMMING_THRESHOLD:
                is_duplicate = True
                # Accumulate dwell time to the existing keyframe
                existing["dwell_time"] += kf["dwell_time"]
                break

        if not is_duplicate:
            unique.append(kf)

    # Clean up phash from output
    for kf in unique:
        del kf["phash"]

    return unique


def debug_extraction(video_path: str, output_dir: str = "debug_output"):
    """
    Run extraction in debug mode with visualization.
    Generates:
    - Per-frame CSV data
    - Motion plot showing dy, peak, and detected dwells
    - Keyframe images

    Use this to tune SCROLL_THRESHOLD and STATIC_PEAK_THRESHOLD.
    """
    import csv

    output_dir = Path(output_dir)
    output_dir.mkdir(exist_ok=True)

    print("=== DEBUG MODE ===")
    print(f"Current thresholds from config:")
    print(f"  SCROLL_THRESHOLD = {config.SCROLL_THRESHOLD}")
    print(f"  STATIC_PEAK_THRESHOLD = {config.STATIC_PEAK_THRESHOLD}")
    print(f"  ROI = ({config.ROI_Y0}, {config.ROI_Y1})")
    print(f"  MIN_DWELL_TIME = {config.MIN_DWELL_TIME}s")
    print()

    # Run extraction with frame-level data collection
    result, frame_data = _extract_with_debug_data(video_path, output_dir)

    # Save frame data to CSV
    csv_path = output_dir / "frame_data.csv"
    with open(csv_path, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["frame_idx", "dy", "peak", "classification"])
        writer.writeheader()
        for fd in frame_data:
            writer.writerow({
                "frame_idx": fd["frame_idx"],
                "dy": fd["dy"],
                "peak": fd["peak"],
                "classification": fd["classification"],
            })
    print(f"Saved frame data to {csv_path}")

    # Generate visualization
    _generate_debug_plot(frame_data, result, output_dir)

    print(f"\n=== SUMMARY ===")
    print(f"Detected {len(result.dwells)} dwells")
    print(f"Estimated {result.estimated_posts_scrolled:.1f} posts scrolled past")
    print(f"Total scroll distance: {result.total_scroll_px:.0f} px")

    print(f"\n=== DETECTED DWELLS ===")
    for i, d in enumerate(result.dwells):
        print(f"  {i}: {d['dwell_time']:.2f}s, video={d['is_video']}, "
              f"saved to {d['keyframe_path']}")

    print(f"\n=== TUNING GUIDANCE ===")
    dy_values = [abs(fd["dy"]) for fd in frame_data]
    peak_values = [fd["peak"] for fd in frame_data]
    print(f"  |dy| range: {min(dy_values):.2f} - {max(dy_values):.2f}, median: {np.median(dy_values):.2f}")
    print(f"  peak range: {min(peak_values):.3f} - {max(peak_values):.3f}, median: {np.median(peak_values):.3f}")
    print(f"\n  If detecting too many dwells: increase SCROLL_THRESHOLD (currently {config.SCROLL_THRESHOLD})")
    print(f"  If missing dwells: decrease SCROLL_THRESHOLD")
    print(f"  See {output_dir}/debug_plot.png for visualization")

    return result


def _extract_with_debug_data(video_path: str, output_dir: Path):
    """Extract keyframes and return frame-level data for debugging."""
    video_path = Path(video_path)

    cap = cv2.VideoCapture(str(video_path))
    if not cap.isOpened():
        raise ValueError(f"Cannot open video: {video_path}")

    video_fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    frame_skip = max(1, int(video_fps / config.MOTION_FPS))
    actual_fps = video_fps / frame_skip

    print(f"Video: {frame_width}x{frame_height} @ {video_fps:.1f}fps, {total_frames} frames")
    print(f"Sampling every {frame_skip} frames -> {actual_fps:.1f} fps for motion detection")

    roi_y0 = config.ROI_Y0
    roi_y1 = frame_height + config.ROI_Y1 if config.ROI_Y1 < 0 else config.ROI_Y1
    print(f"ROI: y=[{roi_y0}, {roi_y1}] (cropping {roi_y0}px top, {frame_height - roi_y1}px bottom)")

    roi_height = roi_y1 - roi_y0
    hanning = cv2.createHanningWindow((frame_width, roi_height), cv2.CV_32F)

    frame_data = []
    prev_gray = None
    frame_idx = 0
    sampled_count = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        if frame_idx % frame_skip == 0:
            roi = frame[roi_y0:roi_y1, :]
            gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY).astype(np.float32)
            gray_windowed = gray * hanning

            if prev_gray is not None:
                (dx, dy), response = cv2.phaseCorrelate(prev_gray, gray_windowed)

                abs_dy = abs(dy)
                if abs_dy > config.SCROLL_THRESHOLD:
                    classification = "SCROLL"
                elif response > config.STATIC_PEAK_THRESHOLD:
                    classification = "DWELL_STATIC"
                else:
                    classification = "DWELL_VIDEO"

                frame_data.append({
                    "frame_idx": frame_idx,
                    "dy": dy,
                    "peak": response,
                    "classification": classification,
                    "gray_roi": gray.copy(),
                    "full_frame": frame.copy(),
                })

            prev_gray = gray_windowed
            sampled_count += 1

        frame_idx += 1

    cap.release()
    print(f"Processed {sampled_count} sampled frames")

    # Process dwells
    dwell_runs = _find_dwell_runs(frame_data, actual_fps)
    dwell_runs = [r for r in dwell_runs if r["duration"] >= config.MIN_DWELL_TIME]
    print(f"Found {len(dwell_runs)} dwell runs >= {config.MIN_DWELL_TIME}s")

    keyframe_candidates = []
    for run in dwell_runs:
        best_frame = _select_sharpest_frame(run["frames"])
        keyframe_candidates.append({
            "frame_data": best_frame,
            "dwell_time": run["duration"],
            "is_video": run["is_video"],
            "start_frame": run["start_idx"],
            "end_frame": run["end_idx"],
        })

    unique_keyframes = _deduplicate_keyframes(keyframe_candidates)
    print(f"After deduplication: {len(unique_keyframes)} unique keyframes")

    dwells = []
    for i, kf in enumerate(unique_keyframes):
        keyframe_path = output_dir / f"keyframe_{i:03d}.jpg"
        cv2.imwrite(str(keyframe_path), kf["frame_data"]["full_frame"])

        dwells.append(DwellEvent(
            keyframe_path=str(keyframe_path),
            dwell_time=kf["dwell_time"],
            is_video=kf["is_video"],
            frame_index=kf["frame_data"]["frame_idx"],
            start_frame=kf["start_frame"],
            end_frame=kf["end_frame"],
        ))

    total_scroll_px = sum(
        abs(fd["dy"]) for fd in frame_data
        if fd["classification"] == "SCROLL"
    )
    estimated_posts = total_scroll_px / config.AVG_POST_HEIGHT_PX

    result = ExtractionResult(
        video_path=str(video_path),
        dwells=[asdict(d) for d in dwells],
        total_scroll_px=total_scroll_px,
        estimated_posts_scrolled=estimated_posts,
        total_frames=total_frames,
        video_fps=video_fps,
        extraction_fps=actual_fps,
    )

    cache_path = output_dir / "extraction_cache.json"
    with open(cache_path, "w") as f:
        json.dump(asdict(result), f, indent=2)
    print(f"Saved extraction cache to {cache_path}")

    return result, frame_data


def _generate_debug_plot(frame_data: list[dict], result: ExtractionResult, output_dir: Path):
    """Generate a visualization of motion detection for tuning."""
    try:
        import matplotlib.pyplot as plt
        import matplotlib.patches as mpatches
    except ImportError:
        print("matplotlib not installed, skipping debug plot")
        return

    frames = [fd["frame_idx"] for fd in frame_data]
    dy_values = [fd["dy"] for fd in frame_data]
    peak_values = [fd["peak"] for fd in frame_data]
    classifications = [fd["classification"] for fd in frame_data]

    fig, axes = plt.subplots(3, 1, figsize=(14, 10), sharex=True)

    # Plot 1: Vertical displacement (dy)
    ax1 = axes[0]
    colors = ["red" if c == "SCROLL" else ("blue" if c == "DWELL_STATIC" else "green")
              for c in classifications]
    ax1.scatter(frames, dy_values, c=colors, s=3, alpha=0.7)
    ax1.axhline(y=config.SCROLL_THRESHOLD, color="orange", linestyle="--", label=f"SCROLL_THRESHOLD={config.SCROLL_THRESHOLD}")
    ax1.axhline(y=-config.SCROLL_THRESHOLD, color="orange", linestyle="--")
    ax1.set_ylabel("dy (pixels)")
    ax1.set_title("Vertical Displacement (dy) - Phase Correlation")
    ax1.legend()
    ax1.grid(True, alpha=0.3)

    # Plot 2: Peak response
    ax2 = axes[1]
    ax2.scatter(frames, peak_values, c=colors, s=3, alpha=0.7)
    ax2.axhline(y=config.STATIC_PEAK_THRESHOLD, color="purple", linestyle="--",
                label=f"STATIC_PEAK_THRESHOLD={config.STATIC_PEAK_THRESHOLD}")
    ax2.set_ylabel("Peak Response")
    ax2.set_title("Phase Correlation Peak (high=static, low=video)")
    ax2.legend()
    ax2.grid(True, alpha=0.3)

    # Plot 3: Classification timeline with dwell regions
    ax3 = axes[2]
    class_to_num = {"SCROLL": 0, "DWELL_STATIC": 1, "DWELL_VIDEO": 2}
    class_nums = [class_to_num[c] for c in classifications]
    ax3.scatter(frames, class_nums, c=colors, s=5, alpha=0.7)

    # Highlight detected dwell regions
    for dwell in result.dwells:
        ax3.axvspan(dwell["start_frame"], dwell["end_frame"],
                    alpha=0.3, color="yellow", label="_nolegend_")
        ax3.axvline(x=dwell["frame_index"], color="black", linestyle=":",
                    alpha=0.5, label="_nolegend_")

    ax3.set_yticks([0, 1, 2])
    ax3.set_yticklabels(["SCROLL", "DWELL_STATIC", "DWELL_VIDEO"])
    ax3.set_xlabel("Frame Index")
    ax3.set_title("Classification (yellow=kept dwells, dotted=keyframe)")
    ax3.grid(True, alpha=0.3)

    # Legend
    scroll_patch = mpatches.Patch(color="red", label="SCROLL")
    static_patch = mpatches.Patch(color="blue", label="DWELL_STATIC")
    video_patch = mpatches.Patch(color="green", label="DWELL_VIDEO")
    ax3.legend(handles=[scroll_patch, static_patch, video_patch], loc="upper right")

    plt.tight_layout()
    plot_path = output_dir / "debug_plot.png"
    plt.savefig(plot_path, dpi=150)
    plt.close()
    print(f"Saved debug plot to {plot_path}")


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: python extract.py <video_path> [--debug]")
        print()
        print("Run with --debug to see per-frame classification and tune thresholds.")
        sys.exit(1)

    video_path = sys.argv[1]
    debug_mode = "--debug" in sys.argv

    if debug_mode:
        debug_extraction(video_path)
    else:
        result = extract_keyframes(video_path)
        print(f"\nExtracted {len(result.dwells)} keyframes")
