import os
import json
from flask import Blueprint, jsonify
from config import CLEANED_FOLDER

social_bp = Blueprint('social_bp', __name__)

@social_bp.route('/social', methods=['GET'])
def get_social():
    def load(name):
        p = os.path.join(CLEANED_FOLDER, name)
        return json.load(open(p)) if os.path.exists(p) else []

    overview = load('tiktok_overview.json')
    audience = load('tiktok_audience.json')
    videos   = load('tiktok_videos.json')

    return jsonify({
        "overview": overview,
        "audience": audience,
        "videos": videos
    })
