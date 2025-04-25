from flask import Blueprint, request, jsonify, current_app
import os

upload_bp = Blueprint('upload', __name__)

@upload_bp.route('', methods=['POST'])
def upload_file():
    """
    Accepts multipart/form-data file uploads and saves them to data/raw/.
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    dest_dir = current_app.config['UPLOAD_FOLDER']
    os.makedirs(dest_dir, exist_ok=True)

    save_path = os.path.join(dest_dir, file.filename)
    file.save(save_path)

    return jsonify({'message': f'File saved to {save_path}'}), 200
