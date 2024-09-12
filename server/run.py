from app import create_app, db
from flask_migrate import Migrate
import os

app = create_app()

# Bind Migrate to the app and the database
migrate = Migrate(app, db)

# Optionally, setting the port from environment variable or fallback to default
if __name__ == "__main__":
    app_env = os.getenv('FLASK_ENV', 'development')
    debug_mode = app_env == 'development'
    app.run(debug=debug_mode, port=os.getenv('PORT', 5000))
