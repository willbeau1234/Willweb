"""
Feed Distortion Index - Configuration

ALL tunable constants live here. Nothing is hardcoded elsewhere.
These are tasteful guesses, not calibrated values.
"""

# =============================================================================
# EXTRACTION SETTINGS (extract.py)
# =============================================================================

# Frame sampling rate for motion detection (frames per second)
MOTION_FPS = 5

# Region of interest: crop to remove Instagram's static UI
# (y0, y1) in pixels from top of frame - TUNE PER RECORDING RESOLUTION
# For 1080p iPhone recording, roughly: top bar ~150px, bottom bar ~150px
ROI_Y0 = 150
ROI_Y1 = -150  # negative means "from bottom"

# Phase correlation thresholds - MUST BE TUNED on real recordings
# |dy| above this = scrolling; below = dwelling
SCROLL_THRESHOLD = 3.0  # pixels of detected vertical shift

# Peak response from phaseCorrelate: high = static image, low = video/animation
STATIC_PEAK_THRESHOLD = 0.3

# Minimum dwell time to count as a "pause" (seconds)
MIN_DWELL_TIME = 0.5

# Perceptual hash deduplication threshold (Hamming distance)
# Lower = stricter matching; 10 is typical for "same image"
PHASH_HAMMING_THRESHOLD = 10

# Estimated average post height in pixels (for scroll distance -> post count)
# This is approximate; varies by content type
AVG_POST_HEIGHT_PX = 600


# =============================================================================
# SCORING SETTINGS (score.py)
# =============================================================================

# Max dimension for image resize before sending to vision model
# Smaller = cheaper tokens, less detail
MAX_IMAGE_DIMENSION = 512

# Claude Haiku pricing (per million tokens) - as of 2025
HAIKU_INPUT_COST_PER_M = 0.80   # $0.80 per 1M input tokens
HAIKU_OUTPUT_COST_PER_M = 4.00  # $4.00 per 1M output tokens

# Model to use for scoring
SCORING_MODEL = "claude-haiku-4-5-20251001"


# =============================================================================
# AGGREGATION SETTINGS (aggregate.py)
# =============================================================================

# Dimension weights (must sum to 1.0)
DIMENSION_WEIGHTS = {
    "appearance": 0.30,
    "idealization": 0.25,
    "arousal": 0.20,
    "negativity": 0.15,
    "aspiration": 0.10,
}

# Power mean exponent (higher = more weight on high scores)
POWER_MEAN_P = 2

# Attention weighting parameters
TAU = 1.5      # dwell time scaling factor (seconds)
GAMMA = 1.0    # arousal boost multiplier
DELTA = 0.3    # video content boost multiplier

# Peak-end scoring weights
ALPHA = 0.5    # weight on weighted mean
BETA = 0.3     # weight on peak
# (1 - ALPHA - BETA) = weight on end

# Number of final posts for "end" calculation
END_K = 3

# Base rates: annual per-person probability of each life event
# Sources: US Census, travel surveys, etc. (rough estimates)
BASE_RATES = {
    "wedding": 0.02,           # ~2% of adults marry per year
    "engagement": 0.025,
    "newborn": 0.012,          # ~12 per 1000 people
    "pregnancy_announcement": 0.015,
    "graduation": 0.03,
    "new_job": 0.15,
    "promotion": 0.08,
    "international_trip": 0.30,
    "domestic_trip": 0.50,
    "concert_event": 0.40,
    "new_home": 0.05,
    "new_car": 0.06,
    "pet_adoption": 0.03,
    "fitness_achievement": 0.10,
    "birthday_party": 0.20,    # not everyone posts theirs
    "holiday_celebration": 0.60,
    "restaurant_meal": 2.0,    # multiple per year
    "mundane_selfie": 5.0,     # very common
    "disaster": 0.01,          # personal disaster/hardship
    "loss_grief": 0.02,
}

# Valence weights for frequency distortion (higher = more distorting)
EVENT_VALENCE = {
    "wedding": 1.2,
    "engagement": 1.1,
    "newborn": 1.2,
    "pregnancy_announcement": 1.1,
    "graduation": 1.0,
    "new_job": 0.9,
    "promotion": 0.9,
    "international_trip": 1.0,
    "domestic_trip": 0.7,
    "concert_event": 0.8,
    "new_home": 1.1,
    "new_car": 0.8,
    "pet_adoption": 0.7,
    "fitness_achievement": 0.9,
    "birthday_party": 0.6,
    "holiday_celebration": 0.5,
    "restaurant_meal": 0.3,
    "mundane_selfie": 0.2,
    "disaster": 1.5,           # negative events weighted higher for distortion
    "loss_grief": 1.5,
}

# Small epsilon to avoid log(0) in frequency calculations
FREQ_EPSILON = 1e-6


# =============================================================================
# RENDERING SETTINGS (render.py)
# =============================================================================

# Output image dimensions
STRIP_WIDTH = 400
STRIP_THUMB_HEIGHT = 120

# Colors (RGB tuples)
COLOR_BACKGROUND = (245, 245, 245)
COLOR_TEXT = (30, 30, 30)
COLOR_ACCENT = (99, 102, 241)  # indigo
COLOR_BAR_BG = (220, 220, 220)

# Font sizes
FONT_SIZE_TITLE = 24
FONT_SIZE_BODY = 14
FONT_SIZE_SMALL = 11
