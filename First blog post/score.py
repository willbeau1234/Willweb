"""
Feed Distortion Index - Scoring Module

One vision-model call per keyframe to score cognitive-science dimensions.
Uses Claude Haiku for cost efficiency.

This is the EXPENSIVE stage - results are cached to the extraction JSON.
"""

import os
import json
import base64
import anthropic
from pathlib import Path
from PIL import Image
import io

import config


def _load_env():
    """Load .env file if it exists."""
    env_path = Path(__file__).parent / '.env'
    if env_path.exists():
        with open(env_path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    os.environ.setdefault(key.strip(), value.strip())


_load_env()


# Scoring prompt - this is cached across all calls
SCORING_SYSTEM_PROMPT = """You are analyzing a screenshot of a social media post for a cognitive science study on feed content.

Score the post on these dimensions (0.0 to 1.0):

1. **appearance**: Focus on physical appearance, beauty, fashion, body image
   - 0.0 = no appearance focus (text-only, abstract, objects)
   - 1.0 = strong appearance focus (selfies, outfit posts, fitness photos)

2. **idealization**: How polished/curated vs authentic/raw the content appears
   - 0.0 = raw, unfiltered, behind-the-scenes, vulnerable
   - 1.0 = highly polished, professional lighting, perfect composition

3. **arousal**: Emotional intensity/activation level
   - 0.0 = calm, neutral, mundane content
   - 1.0 = exciting, dramatic, emotionally charged

4. **negativity**: Negative emotional valence
   - 0.0 = positive, uplifting, joyful
   - 1.0 = negative, sad, angry, distressing

5. **aspiration**: Depicts lifestyle/achievements viewers might envy or aspire to
   - 0.0 = ordinary, relatable, everyday content
   - 1.0 = luxury, success, major achievements, travel, exclusive access

Also identify any major life events depicted (wedding, travel, newborn, graduation, etc.).

IMPORTANT: Before scoring, briefly describe what you SEE in the image. This grounds your scores in observable evidence.

Respond with ONLY valid JSON (no markdown fences, no preamble):
{
  "caption": "<one factual sentence describing the post>",
  "appearance": {"score": 0.0, "why": "<few words>"},
  "idealization": {"score": 0.0, "why": "<few words>"},
  "arousal": {"score": 0.0, "why": "<few words>"},
  "negativity": {"score": 0.0, "why": "<few words>"},
  "aspiration": {"score": 0.0, "why": "<few words>"},
  "events": ["<life events if any, or empty list>"]
}"""


def resize_image_for_api(image_path: str, max_dim: int = None) -> tuple[str, str]:
    """
    Resize image to reduce token cost and return as base64.
    Returns (base64_data, media_type).
    """
    if max_dim is None:
        max_dim = config.MAX_IMAGE_DIMENSION

    with Image.open(image_path) as img:
        # Convert to RGB if necessary (handles RGBA, etc.)
        if img.mode not in ("RGB", "L"):
            img = img.convert("RGB")

        # Resize if larger than max dimension
        width, height = img.size
        if max(width, height) > max_dim:
            scale = max_dim / max(width, height)
            new_size = (int(width * scale), int(height * scale))
            img = img.resize(new_size, Image.Resampling.LANCZOS)

        # Save to bytes
        buffer = io.BytesIO()
        img.save(buffer, format="JPEG", quality=85)
        buffer.seek(0)

        base64_data = base64.standard_b64encode(buffer.read()).decode("utf-8")
        return base64_data, "image/jpeg"


def score_keyframe(client: anthropic.Anthropic, image_path: str) -> dict:
    """
    Score a single keyframe using Claude Haiku.
    Returns the parsed scores dict and token usage.
    """
    # Resize and encode image
    image_data, media_type = resize_image_for_api(image_path)

    # Make API call with prompt caching on system prompt
    response = client.messages.create(
        model=config.SCORING_MODEL,
        max_tokens=500,
        system=[
            {
                "type": "text",
                "text": SCORING_SYSTEM_PROMPT,
                "cache_control": {"type": "ephemeral"}
            }
        ],
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": media_type,
                            "data": image_data,
                        },
                    },
                    {
                        "type": "text",
                        "text": "Score this social media post."
                    }
                ],
            }
        ],
    )

    # Extract usage
    usage = {
        "input_tokens": response.usage.input_tokens,
        "output_tokens": response.usage.output_tokens,
        "cache_read_tokens": getattr(response.usage, "cache_read_input_tokens", 0),
        "cache_creation_tokens": getattr(response.usage, "cache_creation_input_tokens", 0),
    }

    # Parse response
    content = response.content[0].text.strip()

    # Try to parse JSON, with one retry on failure
    try:
        scores = json.loads(content)
    except json.JSONDecodeError:
        # Sometimes model adds markdown fences despite instructions
        content = content.strip("`").strip()
        if content.startswith("json"):
            content = content[4:].strip()
        try:
            scores = json.loads(content)
        except json.JSONDecodeError as e:
            print(f"  WARNING: Failed to parse JSON: {e}")
            print(f"  Raw response: {content[:200]}...")
            # Return empty scores
            scores = {
                "caption": "Failed to parse",
                "appearance": {"score": 0.5, "why": "parse error"},
                "idealization": {"score": 0.5, "why": "parse error"},
                "arousal": {"score": 0.5, "why": "parse error"},
                "negativity": {"score": 0.5, "why": "parse error"},
                "aspiration": {"score": 0.5, "why": "parse error"},
                "events": [],
            }

    return scores, usage


def score_extraction(cache_path: str, force: bool = False) -> dict:
    """
    Score all keyframes in an extraction cache.
    Appends scores to the cache JSON.

    Args:
        cache_path: Path to extraction_cache.json
        force: If True, re-score even if scores already exist

    Returns:
        Updated extraction data with scores
    """
    cache_path = Path(cache_path)

    with open(cache_path) as f:
        data = json.load(f)

    # Check if already scored
    if not force and data["dwells"] and "scores" in data["dwells"][0]:
        print("Scores already exist in cache. Use force=True to re-score.")
        return data

    # Initialize API client
    client = anthropic.Anthropic()

    # Track totals
    total_input = 0
    total_output = 0
    total_cache_read = 0
    total_cache_create = 0

    print(f"Scoring {len(data['dwells'])} keyframes...")
    print()

    for i, dwell in enumerate(data["dwells"]):
        keyframe_path = dwell["keyframe_path"]
        print(f"[{i+1}/{len(data['dwells'])}] Scoring {Path(keyframe_path).name}...")

        scores, usage = score_keyframe(client, keyframe_path)

        # Add scores to dwell
        dwell["scores"] = scores

        # Accumulate usage
        total_input += usage["input_tokens"]
        total_output += usage["output_tokens"]
        total_cache_read += usage["cache_read_tokens"]
        total_cache_create += usage["cache_creation_tokens"]

        print(f"  Caption: {scores.get('caption', 'N/A')[:60]}...")
        print(f"  Tokens: {usage['input_tokens']} in, {usage['output_tokens']} out, "
              f"{usage['cache_read_tokens']} cache read")

    # Calculate cost
    # Haiku pricing: $0.25/M input, $1.25/M output
    # Cache read is 90% cheaper, cache write is 25% more expensive
    input_cost = (total_input / 1_000_000) * config.HAIKU_INPUT_COST_PER_M
    output_cost = (total_output / 1_000_000) * config.HAIKU_OUTPUT_COST_PER_M
    cache_read_cost = (total_cache_read / 1_000_000) * config.HAIKU_INPUT_COST_PER_M * 0.1
    cache_create_cost = (total_cache_create / 1_000_000) * config.HAIKU_INPUT_COST_PER_M * 1.25
    total_cost = input_cost + output_cost + cache_read_cost + cache_create_cost

    print()
    print("=== TOKEN USAGE ===")
    print(f"  Input tokens:  {total_input:,}")
    print(f"  Output tokens: {total_output:,}")
    print(f"  Cache read:    {total_cache_read:,}")
    print(f"  Cache create:  {total_cache_create:,}")
    print()
    print(f"=== COST (at Haiku rates) ===")
    print(f"  Input:       ${input_cost:.4f}")
    print(f"  Output:      ${output_cost:.4f}")
    print(f"  Cache read:  ${cache_read_cost:.4f}")
    print(f"  Cache write: ${cache_create_cost:.4f}")
    print(f"  TOTAL:       ${total_cost:.4f}")

    # Add usage summary to data
    data["scoring_usage"] = {
        "input_tokens": total_input,
        "output_tokens": total_output,
        "cache_read_tokens": total_cache_read,
        "cache_creation_tokens": total_cache_create,
        "estimated_cost_usd": total_cost,
    }

    # Save updated cache
    with open(cache_path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"\nSaved scores to {cache_path}")

    return data


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: python score.py <extraction_cache.json> [--force]")
        print()
        print("Scores all keyframes in the extraction cache using Claude Haiku.")
        print("Use --force to re-score even if scores already exist.")
        sys.exit(1)

    cache_path = sys.argv[1]
    force = "--force" in sys.argv

    score_extraction(cache_path, force=force)
