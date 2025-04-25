from flask import Blueprint, jsonify, current_app
from utils.etl import run_etl

reprocess_bp = Blueprint('reprocess', __name__)

@reprocess_bp.route('', methods=['POST'])
def reprocess_all():
    """
    Trigger full ETL: reads raw files, normalizes, writes to DB, moves to cleaned/.
    """
    try:
        with current_app.app_context():
            run_etl()
        return jsonify({'message': 'Reprocessing complete'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
