import os
import logging
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from config import UPLOAD_FOLDER, ALLOWED_EXTENSIONS
from utils.etl import process_all

upload_bp = Blueprint('upload_bp', __name__)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@upload_bp.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        save_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(save_path)
        logging.info(f"Uploaded: {filename}")
        return jsonify({"filename": filename}), 200
    return jsonify({"error": "File type not allowed"}), 400

@upload_bp.route('/reprocess', methods=['POST'])
def reprocess():
    try:
        processed = process_all()
        return jsonify({"status": "ok", "processed": processed}), 200
    except Exception as e:
        logging.exception("ETL failed")
        return jsonify({"status": "error", "message": str(e)}), 500
