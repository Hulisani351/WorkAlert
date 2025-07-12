from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "https://workalert.fly.dev",
            "http://localhost:5173",  # For local development
            "http://localhost:3000"   # For local development
        ],
        "methods": ["POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Set up upload folder
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/api/upload', methods=['POST'])
def register():
    cv = request.files.get('cv')
    skills = request.form.get('skills')
    whatsapp = request.form.get('whatsapp')
    email = request.form.get('email')

    if not cv and not skills:
        return jsonify({'error': 'Please provide a CV or skills'}), 400
    if not whatsapp and not email:
        return jsonify({'error': 'Please provide either WhatsApp or Email'}), 400

    if cv:
        filename = cv.filename
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        cv.save(filepath)

    return jsonify({
        'message': 'You are now on the list for job alerts.',
        'data': {
            'skills': skills,
            'whatsapp': whatsapp,
            'email': email,
            'cv': cv.filename if cv else None
        }
    }), 200

if __name__ == '__main__':
    print("✅ Backend is running on http://0.0.0.0:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)

