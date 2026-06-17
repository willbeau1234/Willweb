#!/usr/bin/env python3
"""
Feed Distortion Index - Main Orchestration

Usage:
    # Full pipeline (extracts, scores, aggregates, renders)
    python main.py video.mp4

    # Recompute with new weights (no API calls, instant)
    python main.py --recompute output/extraction_cache.json

    # Debug extraction only
    python main.py --debug video.mp4
"""

import sys
import argparse
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(
        description="Feed Distortion Index - Analyze your social media scroll patterns"
    )
    parser.add_argument(
        "input",
        help="Video file (.mp4) or extraction cache (.json for --recompute)"
    )
    parser.add_argument(
        "--output-dir", "-o",
        default="output",
        help="Output directory (default: output)"
    )
    parser.add_argument(
        "--debug",
        action="store_true",
        help="Run extraction in debug mode (prints per-frame data for tuning)"
    )
    parser.add_argument(
        "--recompute",
        action="store_true",
        help="Skip extraction/scoring, just recompute aggregation from cached JSON"
    )
    parser.add_argument(
        "--force-score",
        action="store_true",
        help="Re-score even if scores already exist in cache"
    )

    args = parser.parse_args()
    input_path = Path(args.input)
    output_dir = Path(args.output_dir)

    # Recompute mode: just run aggregation and rendering
    if args.recompute:
        if not input_path.suffix == ".json":
            print("Error: --recompute requires a .json cache file")
            sys.exit(1)

        print("=== RECOMPUTE MODE (no API calls) ===")
        print()

        from aggregate import compute_distortion, print_report
        from render import render_from_cache

        results = compute_distortion(str(input_path))
        if "error" in results:
            print(f"Error: {results['error']}")
            sys.exit(1)

        print_report(results)

        report_path = render_from_cache(str(input_path))
        print(f"\nReport image: {report_path}")

        return

    # Full pipeline mode
    if not input_path.exists():
        print(f"Error: File not found: {input_path}")
        sys.exit(1)

    output_dir.mkdir(exist_ok=True)

    # Stage 1: Extraction
    print("=" * 60)
    print("STAGE 1: EXTRACTION")
    print("=" * 60)
    print()

    from extract import extract_keyframes, debug_extraction

    if args.debug:
        result = debug_extraction(str(input_path), str(output_dir))
        print("\n[DEBUG MODE] Review the output and tune thresholds in config.py")
        print("Run without --debug when dwells look correct.")
        return
    else:
        result = extract_keyframes(str(input_path), str(output_dir))

    cache_path = output_dir / "extraction_cache.json"

    if len(result.dwells) == 0:
        print("\nNo dwells detected! Try adjusting thresholds in config.py")
        print("Run with --debug to see per-frame data.")
        sys.exit(1)

    print(f"\nExtracted {len(result.dwells)} keyframes")

    # Stage 2: Scoring
    print()
    print("=" * 60)
    print("STAGE 2: SCORING (API calls)")
    print("=" * 60)
    print()

    from score import score_extraction

    score_extraction(str(cache_path), force=args.force_score)

    # Stage 3: Aggregation
    print()
    print("=" * 60)
    print("STAGE 3: AGGREGATION")
    print("=" * 60)
    print()

    from aggregate import compute_distortion, print_report

    results = compute_distortion(str(cache_path))

    if "error" in results:
        print(f"Error: {results['error']}")
        sys.exit(1)

    print_report(results)

    # Stage 4: Rendering
    print()
    print("=" * 60)
    print("STAGE 4: RENDERING")
    print("=" * 60)
    print()

    from render import render_from_cache

    report_path = render_from_cache(str(cache_path))
    print(f"Report image saved to: {report_path}")

    # Summary
    print()
    print("=" * 60)
    print("COMPLETE")
    print("=" * 60)
    print()
    print(f"Output directory: {output_dir}")
    print(f"  - extraction_cache.json (cached scores)")
    print(f"  - distortion_results.json (aggregated results)")
    print(f"  - feed_report.png (visual report)")
    print(f"  - keyframe_*.jpg (detected posts)")
    print()
    print("To re-tune weights without re-scoring:")
    print(f"  python main.py --recompute {cache_path}")


if __name__ == "__main__":
    main()
