import os
from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS  # Import CORS

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__, static_folder='../client/my-tic-tac-toe-app/dist', static_url_path='')

    app.config.from_object('config.Config')

    db.init_app(app)
    migrate.init_app(app, db)

    # Enable CORS for all routes
    CORS(app, supports_credentials=True)

    # Register blueprints here
    from .user_routes import user_blueprint
    from .game_routes import game_blueprint
    from .user_games_routes import user_games_blueprint

    app.register_blueprint(user_blueprint)
    app.register_blueprint(game_blueprint)
    app.register_blueprint(user_games_blueprint)

    # Serve React app
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_react(path):
        print("React app serving path:", path)
        if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, 'index.html')

    return app
