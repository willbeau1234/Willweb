"""
Feed Distortion Index - Rendering Module

Generates visual output: scroll journey strip and score breakdown.
Uses PIL/Pillow for layout (NOT OpenCV drawing).

IMPORTANT: Displays only GENERIC labels, never raw captions under faces.
"""

import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

import config


# Generic category labels for display (privacy-safe)
DIMENSION_LABELS = {
    "appearance": "Appearance",
    "idealization": "Polished / Curated",
    "arousal": "High Energy",
    "negativity": "Negative Tone",
    "aspiration": "Aspirational",
}

# Map top dimensions to generic content labels
CONTENT_LABELS = {
    "appearance": "lifestyle / appearance",
    "idealization": "polished content",
    "arousal": "engaging / intense",
    "negativity": "serious / heavy",
    "aspiration": "success / travel",
}


def render_report(
    results: dict,
    dwells: list[dict],
    output_path: str = "feed_report.png"
) -> str:
    """
    Render a visual report with scroll journey and score breakdown.

    Args:
        results: Output from aggregate.compute_distortion()
        dwells: The dwells list from extraction cache (for keyframe paths)
        output_path: Where to save the output image

    Returns:
        Path to saved image
    """
    # Configuration
    strip_width = config.STRIP_WIDTH
    thumb_height = config.STRIP_THUMB_HEIGHT
    padding = 20
    bar_height = 25

    # Colors
    bg_color = config.COLOR_BACKGROUND
    text_color = config.COLOR_TEXT
    accent_color = config.COLOR_ACCENT
    bar_bg = config.COLOR_BAR_BG

    # Try to load a font, fall back to default
    try:
        font_title = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", config.FONT_SIZE_TITLE)
        font_body = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", config.FONT_SIZE_BODY)
        font_small = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", config.FONT_SIZE_SMALL)
    except OSError:
        font_title = ImageFont.load_default()
        font_body = ImageFont.load_default()
        font_small = ImageFont.load_default()

    # Calculate dimensions
    num_posts = len(results["per_post"])
    strip_height = num_posts * (thumb_height + 10) + 100
    score_panel_height = 400
    total_height = max(strip_height, score_panel_height) + padding * 2

    # Create canvas - two columns
    score_panel_width = 450
    total_width = strip_width + score_panel_width + padding * 3

    img = Image.new("RGB", (total_width, total_height), bg_color)
    draw = ImageDraw.Draw(img)

    # ==========================================================================
    # LEFT: Scroll journey strip
    # ==========================================================================
    x_strip = padding
    y = padding

    draw.text((x_strip, y), "Your Scroll Journey", font=font_title, fill=text_color)
    y += 35

    # Draw each post thumbnail
    for i, post in enumerate(results["per_post"]):
        # Find corresponding dwell for keyframe path
        dwell = dwells[i] if i < len(dwells) else None
        if dwell and "keyframe_path" in dwell:
            try:
                thumb = Image.open(dwell["keyframe_path"])
                # Calculate thumbnail size preserving aspect ratio
                aspect = thumb.width / thumb.height
                thumb_w = int(thumb_height * aspect)
                thumb_w = min(thumb_w, strip_width - 80)  # Leave room for label
                thumb = thumb.resize((thumb_w, thumb_height), Image.Resampling.LANCZOS)

                # Tint based on dwell time (longer = more saturated)
                # This is subtle - just adjust brightness slightly
                max_dwell = max(p["dwell_time"] for p in results["per_post"])
                brightness = 0.7 + 0.3 * (post["dwell_time"] / max_dwell)

                img.paste(thumb, (x_strip, y))

                # Draw dwell time badge
                badge_x = x_strip + thumb_w + 10
                draw.text(
                    (badge_x, y + 5),
                    f"{post['dwell_time']:.1f}s",
                    font=font_body,
                    fill=accent_color
                )

                # Draw generic category label (NOT the caption)
                top_dim = post["top_dimension"]
                label = CONTENT_LABELS.get(top_dim, top_dim)
                draw.text(
                    (badge_x, y + 25),
                    label,
                    font=font_small,
                    fill=text_color
                )

            except Exception as e:
                # If can't load image, draw placeholder
                draw.rectangle(
                    [x_strip, y, x_strip + 100, y + thumb_height],
                    outline=text_color
                )

        y += thumb_height + 10

    # ==========================================================================
    # RIGHT: Score panel
    # ==========================================================================
    x_panel = strip_width + padding * 2
    y = padding

    # Overall score
    score = results["overall_score"]
    draw.text((x_panel, y), "Feed Distortion Index", font=font_title, fill=text_color)
    y += 40

    # Big score number
    score_text = f"{score:.0f}"
    # Draw it large
    try:
        font_big = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 72)
    except OSError:
        font_big = font_title
    draw.text((x_panel, y), score_text, font=font_big, fill=accent_color)

    # /100 suffix
    draw.text((x_panel + 100, y + 40), "/ 100", font=font_body, fill=text_color)
    y += 90

    # Interpretation
    draw.text((x_panel, y), results["interpretation"], font=font_small, fill=text_color)
    y += 30

    # Dimension bars
    y += 20
    draw.text((x_panel, y), "What You Stopped On vs What Was Served", font=font_body, fill=text_color)
    y += 30

    bar_width = 300

    for dim in ["appearance", "idealization", "arousal", "negativity", "aspiration"]:
        data = results["dimension_averages"][dim]
        label = DIMENSION_LABELS[dim]

        # Label
        draw.text((x_panel, y), label, font=font_small, fill=text_color)
        y += 18

        # Background bar
        draw.rectangle(
            [x_panel, y, x_panel + bar_width, y + bar_height],
            fill=bar_bg
        )

        # Served (lighter)
        served_width = int(data["served"] * bar_width)
        draw.rectangle(
            [x_panel, y, x_panel + served_width, y + bar_height],
            fill=(180, 180, 220)
        )

        # Stopped on (darker, overlaid)
        stopped_width = int(data["stopped_on"] * bar_width)
        draw.rectangle(
            [x_panel, y + 5, x_panel + stopped_width, y + bar_height - 5],
            fill=accent_color
        )

        # Gap indicator
        gap = data["gap"]
        gap_str = f"{gap:+.2f}"
        gap_color = (0, 150, 0) if gap > 0 else (150, 0, 0) if gap < 0 else text_color
        draw.text((x_panel + bar_width + 10, y + 3), gap_str, font=font_small, fill=gap_color)

        y += bar_height + 15

    # Stats footer
    y += 20
    stats = results["dwell_stats"]
    draw.text(
        (x_panel, y),
        f"Analyzed {results['num_posts_analyzed']} posts • {stats['total_dwell_time']:.0f}s total viewing",
        font=font_small,
        fill=(120, 120, 120)
    )

    # Key insight (the gap)
    y += 30
    max_gap_dim = max(
        results["dimension_averages"].keys(),
        key=lambda d: abs(results["dimension_averages"][d]["gap"])
    )
    max_gap = results["dimension_averages"][max_gap_dim]["gap"]

    if abs(max_gap) > 0.05:
        direction = "more" if max_gap > 0 else "less"
        insight = f"You stopped {direction} on {DIMENSION_LABELS[max_gap_dim].lower()} content than average"
        draw.rectangle(
            [x_panel - 5, y - 5, x_panel + bar_width + 50, y + 25],
            fill=(255, 250, 220)
        )
        draw.text((x_panel, y), insight, font=font_small, fill=text_color)

    # Save
    img.save(output_path, quality=95)
    return output_path


def render_from_cache(cache_path: str, output_path: str = None) -> str:
    """
    Render report from extraction cache file.

    Args:
        cache_path: Path to extraction_cache.json (must have scores)
        output_path: Where to save (default: same dir as cache)

    Returns:
        Path to saved image
    """
    from aggregate import compute_distortion

    cache_path = Path(cache_path)

    with open(cache_path) as f:
        data = json.load(f)

    # Compute distortion scores
    results = compute_distortion(str(cache_path))

    if "error" in results:
        raise ValueError(results["error"])

    # Default output path
    if output_path is None:
        output_path = cache_path.parent / "feed_report.png"

    # Filter dwells to match what aggregate used (non-trivial posts only)
    valid_dwells = []
    for d in data["dwells"]:
        if "scores" not in d:
            continue
        scores = d["scores"]
        total = sum(
            scores[dim]["score"]
            for dim in ["appearance", "idealization", "arousal", "negativity", "aspiration"]
        )
        if total > 0.5:
            valid_dwells.append(d)

    return render_report(results, valid_dwells, str(output_path))


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: python render.py <extraction_cache.json> [output.png]")
        sys.exit(1)

    cache_path = sys.argv[1]
    output_path = sys.argv[2] if len(sys.argv) > 2 else None

    try:
        result_path = render_from_cache(cache_path, output_path)
        print(f"Report saved to {result_path}")
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
