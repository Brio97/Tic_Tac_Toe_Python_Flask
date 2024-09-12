from flask import Blueprint, request, jsonify, session
from .models import User
from . import db
import re

user_blueprint = Blueprint('user', __name__)

def is_valid_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

@user_blueprint.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or 'username' not in data or 'email' not in data or 'password' not in data:
        return jsonify({"message": "Missing fields"}), 400

    if not is_valid_email(data['email']):
        return jsonify({"message": "Invalid email format"}), 400

    if User.query.filter_by(username=data['username']).first():
        return jsonify({"message": "User already exists"}), 400

    new_user = User(username=data['username'], email=data['email'])
    new_user.set_password(data['password'])

    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500

    return jsonify({"message": "User registered successfully"}), 201

@user_blueprint.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    identifier = data.get('identifier')
    password = data.get('password')

    if not identifier or not password:
        return jsonify({"error": "Missing identifier or password"}), 400

    # Try to find user by email or username
    user = None
    if is_valid_email(identifier):
        user = User.query.filter_by(email=identifier).first()
    else:
        user = User.query.filter_by(username=identifier).first()

    if user and user.check_password(password):
        session['user_id'] = user.id
        return jsonify({"message": "Login successful"}), 200
    return jsonify({"error": "Invalid credentials"}), 401

@user_blueprint.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({"message": "Logged out successfully"}), 200

@user_blueprint.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"message": "User not found"}), 404

    if 'username' in data:
        user.username = data['username']
    
    try:
        db.session.commit()
        return jsonify({"message": "User updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500
