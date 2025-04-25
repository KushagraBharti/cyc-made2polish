import os
import logging
from flask import Flask, jsonify
from flask_cors import CORS

from config import UPLOAD_FOLDER, CLEANED_FOLDER, LOG_FOLDER
from routes.upload import upload_bp
from routes.sales import sales_bp
from routes.social import social_bp

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Ensure necessary directories exist
    for folder in [UPLOAD_FOLDER, CLEANED_FOLDER, LOG_FOLDER]:
        os.makedirs(folder, exist_ok=True)

    # Logging configuration
    logging.basicConfig(
        filename=os.path.join(LOG_FOLDER, 'app.log'),
        level=logging.INFO,
        format='%(asctime)s %(levelname)s: %(message)s'
    )
    app.logger = logging.getLogger(__name__)

    # Register blueprints
    app.register_blueprint(upload_bp, url_prefix='/api')
    app.register_blueprint(sales_bp, url_prefix='/api')
    app.register_blueprint(social_bp, url_prefix='/api')

    @app.route('/')
    def index():
        return jsonify({"message": "API is running"})

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
