from flask import Flask
from flask_cors import CORS
from config import Config

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from models.sales import Base as SalesBase
from models.inventory import Base as InventoryBase
from models.social import Base as SocialBase

def create_app():
    app = Flask(__name__, static_folder=None)
    app.config.from_object(Config)
    CORS(app)

    # Initialize DB engine & session
    engine = create_engine(app.config['SQLALCHEMY_DATABASE_URI'], echo=False)
    SessionLocal = sessionmaker(bind=engine)

    # Create tables if they don't exist
    SalesBase.metadata.create_all(engine)
    InventoryBase.metadata.create_all(engine)
    SocialBase.metadata.create_all(engine)

    # Attach session factory to app
    app.session = SessionLocal

    # Register blueprints
    from routes.upload import upload_bp
    from routes.reprocess import reprocess_bp
    from routes.dashboard import dashboard_bp

    app.register_blueprint(upload_bp, url_prefix='/api/upload')
    app.register_blueprint(reprocess_bp, url_prefix='/api/reprocess')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')

    @app.route('/')
    def index():
        return 'Hello, Made2Polish Data Dashboard!'

    return app

if __name__ == '__main__':
    app = create_app()
    # In development, auto-reload on changes:
    app.run(host='0.0.0.0', port=5000, debug=True)
