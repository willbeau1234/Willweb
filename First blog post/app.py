"""
Feed Distortion Index - Web UI

A simple Flask app with drag-and-drop video upload.
"""

import os
import json
import threading
from pathlib import Path
from flask import Flask, render_template, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename

# Load .env file if it exists
env_path = Path(__file__).parent / '.env'
if env_path.exists():
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                os.environ.setdefault(key.strip(), value.strip())

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['OUTPUT_FOLDER'] = 'output'
app.config['MAX_CONTENT_LENGTH'] = 500 * 1024 * 1024  # 500MB max

# Ensure folders exist
Path(app.config['UPLOAD_FOLDER']).mkdir(exist_ok=True)
Path(app.config['OUTPUT_FOLDER']).mkdir(exist_ok=True)

# Track processing status
processing_status = {
    'stage': 'idle',
    'message': '',
    'progress': 0,
    'complete': False,
    'error': None,
    'results': None
}


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/upload', methods=['POST'])
def upload_video():
    global processing_status

    if 'video' not in request.files:
        return jsonify({'error': 'No video file provided'}), 400

    file = request.files['video']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    if not file.filename.lower().endswith(('.mp4', '.mov', '.avi', '.webm')):
        return jsonify({'error': 'Invalid file type. Please upload a video file.'}), 400

    # Save the file
    filename = secure_filename(file.filename)
    filepath = Path(app.config['UPLOAD_FOLDER']) / filename
    file.save(filepath)

    # Reset status
    processing_status = {
        'stage': 'uploaded',
        'message': 'Video uploaded, starting processing...',
        'progress': 5,
        'complete': False,
        'error': None,
        'results': None
    }

    # Process in background thread
    thread = threading.Thread(target=process_video, args=(str(filepath),))
    thread.start()

    return jsonify({'status': 'processing', 'filename': filename})


def process_video(video_path):
    """Process video through the full pipeline."""
    global processing_status

    output_dir = Path(app.config['OUTPUT_FOLDER'])

    try:
        # Stage 1: Extraction
        processing_status['stage'] = 'extracting'
        processing_status['message'] = 'Analyzing video for scroll patterns...'
        processing_status['progress'] = 10

        from extract import extract_keyframes
        result = extract_keyframes(video_path, str(output_dir))

        if len(result.dwells) == 0:
            processing_status['error'] = 'No pauses detected. Try scrolling more slowly or adjusting thresholds.'
            return

        processing_status['progress'] = 30
        processing_status['message'] = f'Found {len(result.dwells)} posts you paused on'

        # Stage 2: Scoring
        processing_status['stage'] = 'scoring'
        processing_status['message'] = 'Analyzing content with AI...'
        processing_status['progress'] = 40

        from score import score_extraction
        cache_path = output_dir / 'extraction_cache.json'
        score_extraction(str(cache_path))

        processing_status['progress'] = 70

        # Stage 3: Aggregation
        processing_status['stage'] = 'aggregating'
        processing_status['message'] = 'Computing distortion score...'
        processing_status['progress'] = 80

        from aggregate import compute_distortion
        results = compute_distortion(str(cache_path))

        if 'error' in results:
            processing_status['error'] = results['error']
            return

        # Stage 4: Rendering
        processing_status['stage'] = 'rendering'
        processing_status['message'] = 'Generating visual report...'
        processing_status['progress'] = 90

        from render import render_from_cache
        render_from_cache(str(cache_path))

        # Complete
        processing_status['stage'] = 'complete'
        processing_status['message'] = 'Analysis complete!'
        processing_status['progress'] = 100
        processing_status['complete'] = True
        processing_status['results'] = results

    except Exception as e:
        processing_status['error'] = str(e)
        processing_status['stage'] = 'error'


@app.route('/status')
def get_status():
    return jsonify(processing_status)


@app.route('/output/<path:filename>')
def serve_output(filename):
    return send_from_directory(app.config['OUTPUT_FOLDER'], filename)


@app.route('/results')
def get_results():
    """Get the full results as JSON."""
    results_path = Path(app.config['OUTPUT_FOLDER']) / 'distortion_results.json'
    if results_path.exists():
        with open(results_path) as f:
            return jsonify(json.load(f))
    return jsonify({'error': 'No results available'}), 404


if __name__ == '__main__':
    # Check for API key
    if not os.environ.get('ANTHROPIC_API_KEY'):
        print("\n⚠️  WARNING: ANTHROPIC_API_KEY not set!")
        print("Set it with: export ANTHROPIC_API_KEY=sk-ant-...")
        print()

    print("Starting Feed Distortion Index...")
    print("Open http://localhost:5001 in your browser")
    print()
    app.run(debug=True, port=5001)
