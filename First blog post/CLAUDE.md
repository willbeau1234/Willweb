# Feed Distortion Index

A blog toy that analyzes Instagram screen recordings to detect which posts users pause on and score them on cognitive-science dimensions.

## Architecture

**Two-stage pipeline with hard seam:**

1. **EXPENSIVE (cached):** `extract.py` + `score.py` - video decode, dwell detection, vision-model calls. Results saved to `extraction_cache.json`.
2. **CHEAP (instant):** `aggregate.py` + `render.py` - pure math on cached JSON. Re-run with different weights in milliseconds.

## Files

- `config.py` - ALL tunable constants (weights, thresholds, base rates). Nothing hardcoded elsewhere.
- `extract.py` - Motion/dwell detection via phase correlation (handles autoplaying video)
- `score.py` - Claude Haiku vision calls, one per keyframe
- `aggregate.py` - Pure math functions, no API calls
- `render.py` - Output visualization (PIL/matplotlib)
- `main.py` - Orchestration

## Key Technical Details

**Why phase correlation, not frame differencing:**
- Instagram posts autoplay video, which creates constant pixel changes
- Frame differencing (absdiff) thinks every video frame is "motion"
- Phase correlation returns (dx, dy) global shift + peak response
- High peak + no shift = static image dwelling
- Low peak + no shift = video dwelling (localized motion, no global shift)
- Large |dy| = scrolling

**Thresholds that MUST be tuned per recording:**
- `SCROLL_THRESHOLD` - |dy| above this = scrolling
- `STATIC_PEAK_THRESHOLD` - peak above this = static image
- `ROI_Y0`, `ROI_Y1` - crop out Instagram's static UI bars

## Usage

```bash
# Full pipeline (extraction -> scoring -> aggregation -> render)
ANTHROPIC_API_KEY=sk-... python main.py video.mp4

# Debug extraction first (tune thresholds before scoring)
python main.py --debug video.mp4

# Re-tune weights without API calls (instant)
python main.py --recompute output/extraction_cache.json

# Individual stages
python extract.py video.mp4 --debug
python score.py output/extraction_cache.json
python aggregate.py output/extraction_cache.json
python render.py output/extraction_cache.json
```

## Important

- This is a toy for a blog post, NOT a research instrument
- All constants are tasteful guesses, not calibrated values
- Display generic labels ("travel / leisure"), never raw captions under faces
