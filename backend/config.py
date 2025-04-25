import os
from dotenv import load_dotenv

load_dotenv()

UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', 'data/raw')
CLEANED_FOLDER = os.getenv('CLEANED_FOLDER', 'data/cleaned')
LOG_FOLDER = os.getenv('LOG_FOLDER', 'logs')
ALLOWED_EXTENSIONS = {'csv', 'xlsx', 'xls'}
