"""
Feed Distortion Index - Aggregation Module

Pure math functions for computing the distortion score.
NO API calls - reads from cached extraction JSON.

This is the CHEAP stage - can be re-run instantly with different weights.
"""

import json
import math
from pathlib import Path

import config


def compute_distortion(cache_path: str) -> dict:
    """
    Compute the Feed Distortion Index from scored extraction data.

    Args:
        cache_path: Path to extraction_cache.json with scores

    Returns:
        Dict with overall score, per-dimension breakdowns, gaps, etc.
    """
    cache_path = Path(cache_path)

    with open(cache_path) as f:
        data = json.load(f)

    dwells = data["dwells"]

    # Filter out non-social-media content (e.g., Control Center)
    # Use a heuristic: if all dimension scores are very low, it's not a real post
    valid_dwells = []
    for d in dwells:
        if "scores" not in d:
            continue
        scores = d["scores"]
        total = sum(
            scores[dim]["score"]
            for dim in ["appearance", "idealization", "arousal", "negativity", "aspiration"]
        )
        if total > 0.5:  # At least some signal
            valid_dwells.append(d)

    if not valid_dwells:
        return {"error": "No valid scored posts found"}

    n = len(valid_dwells)

    # ==========================================================================
    # Per-post intensity (power mean of dimension scores)
    # ==========================================================================
    post_intensities = []
    for d in valid_dwells:
        scores = d["scores"]
        weighted_sum = 0.0
        for dim, weight in config.DIMENSION_WEIGHTS.items():
            s = scores[dim]["score"]
            weighted_sum += weight * (s ** config.POWER_MEAN_P)
        intensity = weighted_sum ** (1 / config.POWER_MEAN_P)
        post_intensities.append(intensity)

    # ==========================================================================
    # Attention weights: omega_i = log(1 + t_i/tau) * (1 + gamma*a_i) * (1 + delta*is_video)
    # ==========================================================================
    raw_weights = []
    for i, d in enumerate(valid_dwells):
        t = d["dwell_time"]
        a = d["scores"]["arousal"]["score"]
        is_video = 1 if d["is_video"] else 0

        omega = (
            math.log(1 + t / config.TAU)
            * (1 + config.GAMMA * a)
            * (1 + config.DELTA * is_video)
        )
        raw_weights.append(omega)

    # Normalize weights
    total_weight = sum(raw_weights)
    norm_weights = [w / total_weight for w in raw_weights]

    # ==========================================================================
    # Peak-end session score
    # ==========================================================================
    # Weighted mean
    d_bar = sum(w * d for w, d in zip(norm_weights, post_intensities))

    # Peak (max intensity)
    d_max = max(post_intensities)

    # End (mean of last k posts)
    k = min(config.END_K, n)
    d_end = sum(post_intensities[-k:]) / k

    # Combined score
    alpha = config.ALPHA
    beta = config.BETA
    overall_score = 100 * (alpha * d_bar + beta * d_max + (1 - alpha - beta) * d_end)

    # ==========================================================================
    # Per-dimension averages (weighted and unweighted)
    # ==========================================================================
    dimension_served = {}  # weighted by attention
    dimension_raw = {}      # unweighted (what was served)

    for dim in config.DIMENSION_WEIGHTS.keys():
        weighted_sum = 0.0
        raw_sum = 0.0
        for i, d in enumerate(valid_dwells):
            s = d["scores"][dim]["score"]
            weighted_sum += norm_weights[i] * s
            raw_sum += s

        dimension_served[dim] = weighted_sum
        dimension_raw[dim] = raw_sum / n

    # ==========================================================================
    # Served-vs-stopped gap (the shareable insight)
    # ==========================================================================
    dimension_gap = {}
    for dim in config.DIMENSION_WEIGHTS.keys():
        gap = dimension_served[dim] - dimension_raw[dim]
        dimension_gap[dim] = gap

    # ==========================================================================
    # Frequency channel (life events)
    # ==========================================================================
    event_counts = {}
    for d in valid_dwells:
        for event in d["scores"].get("events", []):
            # Normalize event names
            event_lower = event.lower().replace(" ", "_").replace("-", "_")
            # Try to match to base rate categories
            matched = False
            for base_event in config.BASE_RATES.keys():
                if base_event in event_lower or event_lower in base_event:
                    event_counts[base_event] = event_counts.get(base_event, 0) + 1
                    matched = True
                    break
            if not matched:
                # Store as-is
                event_counts[event_lower] = event_counts.get(event_lower, 0) + 1

    # Compute frequency surprises
    freq_surprises = {}
    total_base_rate = sum(config.BASE_RATES.values())

    for event, count in event_counts.items():
        feed_share = count / n
        pop_share = config.BASE_RATES.get(event, 0.01) / total_base_rate  # default rare

        # Signed log ratio (positive = over-represented, negative = under)
        epsilon = config.FREQ_EPSILON
        surprise = math.log(feed_share + epsilon) - math.log(pop_share + epsilon)

        freq_surprises[event] = {
            "count": count,
            "feed_share": feed_share,
            "pop_share": pop_share,
            "surprise": surprise,
            "over_represented": surprise > 0,
        }

    # Frequency distortion score
    freq_distortion = 0.0
    for event, info in freq_surprises.items():
        valence = config.EVENT_VALENCE.get(event, 0.5)
        freq_distortion += valence * abs(info["surprise"])

    # ==========================================================================
    # Compile results
    # ==========================================================================
    results = {
        "overall_score": overall_score,
        "interpretation": _interpret_score(overall_score),

        "num_posts_analyzed": n,
        "estimated_posts_scrolled": data.get("estimated_posts_scrolled", 0),

        "per_post": [
            {
                "caption": d["scores"]["caption"],
                "dwell_time": d["dwell_time"],
                "intensity": post_intensities[i],
                "attention_weight": norm_weights[i],
                "top_dimension": max(
                    config.DIMENSION_WEIGHTS.keys(),
                    key=lambda dim: d["scores"][dim]["score"]
                ),
            }
            for i, d in enumerate(valid_dwells)
        ],

        "dimension_averages": {
            dim: {
                "served": dimension_raw[dim],
                "stopped_on": dimension_served[dim],
                "gap": dimension_gap[dim],
            }
            for dim in config.DIMENSION_WEIGHTS.keys()
        },

        "peak_end": {
            "weighted_mean": d_bar,
            "peak": d_max,
            "end": d_end,
        },

        "frequency_analysis": {
            "events_detected": freq_surprises,
            "frequency_distortion": freq_distortion,
        },

        "dwell_stats": {
            "total_dwell_time": sum(d["dwell_time"] for d in valid_dwells),
            "avg_dwell_time": sum(d["dwell_time"] for d in valid_dwells) / n,
            "total_scroll_px": data.get("total_scroll_px", 0),
        },
    }

    return results


def _interpret_score(score: float) -> str:
    """Generate a human-readable interpretation of the score."""
    if score < 20:
        return "Very low distortion - your feed seems balanced"
    elif score < 40:
        return "Low distortion - some attention-grabbing content"
    elif score < 60:
        return "Moderate distortion - noticeable pull toward intense content"
    elif score < 80:
        return "High distortion - strong skew toward emotionally charged posts"
    else:
        return "Very high distortion - feed heavily optimized for engagement"


def print_report(results: dict):
    """Print a formatted report of the analysis."""
    print("=" * 60)
    print("FEED DISTORTION INDEX REPORT")
    print("=" * 60)
    print()

    print(f"Overall Score: {results['overall_score']:.1f} / 100")
    print(f"Interpretation: {results['interpretation']}")
    print()

    print(f"Posts analyzed: {results['num_posts_analyzed']}")
    print(f"Estimated posts scrolled past: {results['estimated_posts_scrolled']:.0f}")
    print(f"Total dwell time: {results['dwell_stats']['total_dwell_time']:.1f}s")
    print()

    print("-" * 40)
    print("DIMENSION BREAKDOWN")
    print("-" * 40)
    print(f"{'Dimension':<15} {'Served':>8} {'Stopped':>8} {'Gap':>8}")
    print("-" * 40)

    for dim, data in results["dimension_averages"].items():
        gap_str = f"{data['gap']:+.2f}"
        print(f"{dim:<15} {data['served']:>8.2f} {data['stopped_on']:>8.2f} {gap_str:>8}")

    print()
    print("-" * 40)
    print("WHAT YOU STOPPED ON")
    print("-" * 40)

    for post in results["per_post"]:
        print(f"  [{post['dwell_time']:.1f}s] {post['top_dimension']}: {post['caption'][:45]}...")

    if results["frequency_analysis"]["events_detected"]:
        print()
        print("-" * 40)
        print("LIFE EVENTS DETECTED")
        print("-" * 40)
        for event, info in results["frequency_analysis"]["events_detected"].items():
            direction = "over" if info["over_represented"] else "under"
            print(f"  {event}: {info['count']}x ({direction}-represented)")

    print()
    print("=" * 60)


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: python aggregate.py <extraction_cache.json>")
        sys.exit(1)

    cache_path = sys.argv[1]
    results = compute_distortion(cache_path)

    if "error" in results:
        print(f"Error: {results['error']}")
        sys.exit(1)

    print_report(results)

    # Also save to JSON
    output_path = Path(cache_path).parent / "distortion_results.json"
    with open(output_path, "w") as f:
        json.dump(results, f, indent=2)
    print(f"\nResults saved to {output_path}")
