
from flask import Flask, request, jsonify
import pytesseract
from PIL import Image
import io

app = Flask(__name__)

@app.route('/ocr', methods=['POST'])
def ocr():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        # Get form data
        form_data = request.form
        name = form_data.get('name', '')
        pan = form_data.get('pan', '')
        dob = form_data.get('dob', '')
        aadhaar = form_data.get('aadhaar', '')

        # Perform OCR
        image = Image.open(io.BytesIO(file.read()))
        ocr_text = pytesseract.image_to_string(image).lower()

        # Perform comparison
        verification_results = {}
        if name and name.lower() in ocr_text:
            verification_results['nameMatch'] = True
        else:
            verification_results['nameMatch'] = False

        if pan and pan.lower() in ocr_text:
            verification_results['panMatch'] = True
        else:
            verification_results['panMatch'] = False

        if dob and dob in ocr_text:
            verification_results['dobMatch'] = True
        else:
            verification_results['dobMatch'] = False

        if aadhaar and aadhaar in ocr_text:
            verification_results['aadhaarMatch'] = True
        else:
            verification_results['aadhaarMatch'] = False

        return jsonify({
            'ocrText': ocr_text,
            'verificationResults': verification_results
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
