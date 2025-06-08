from flask import Flask, request, jsonify
from flask_cors import CORS
from deepface import DeepFace
import cv2
import numpy as np
import base64

app = Flask(__name__)
CORS(app)

@app.route('/verify-age', methods=['POST'])
def verify_age():
    try:
        data = request.get_json()
        image_data = data['image'].split(',')[1]
        decoded_data = base64.b64decode(image_data)
        np_arr = np.frombuffer(decoded_data, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        analysis = DeepFace.analyze(img, actions=['age'], enforce_detection=False)

        return jsonify({
            "status": "success",
            "age": int(analysis[0]['age'])
        })

    except Exception as e:
        print("Error:", e)
        return jsonify({"status": "error", "message": "Error processing image"}), 500

# ✅ Correct this line:
if __name__ == '__main__':
    app.run(debug=True)
