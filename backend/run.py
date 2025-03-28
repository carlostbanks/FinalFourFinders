from app import create_app
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Debug - print environment variables
print(f"Environment variables:")
print(f"DATABASE_URL: {os.environ.get('DATABASE_URL')}")
print(f"FLASK_APP: {os.environ.get('FLASK_APP')}")
print(f"FLASK_ENV: {os.environ.get('FLASK_ENV')}")

# Create the Flask application
app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5001))
    app.run(host='0.0.0.0', port=port, debug=True)