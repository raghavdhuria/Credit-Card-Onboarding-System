
from flask import Flask, request, jsonify
import google.generativeai as genai
from PIL import Image
import io
import os
import time
import json

app = Flask(__name__)

# Configure the Gemini API key
genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))

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

        # Prepare the image for Gemini
        image = Image.open(io.BytesIO(file.read()))

        # Create the prompt for Gemini
        prompt = f"""
        You are a document verification assistant. Your task is to compare the information provided in a form with the information present in an uploaded document image. 

        Form Data:
        - Name: {name}
        - PAN Card: {pan}
        - Date of Birth: {dob}
        - Aadhaar Card: {aadhaar}

        Instructions:
        1. Analyze the uploaded document image and extract the relevant information.
        2. Compare the extracted information with the provided form data.
        3. For each field (Name, PAN Card, Date of Birth, Aadhaar Card), determine if there is a match.
        4. A match is considered successful if the value from the form is present in the document.
        5. It is okay if some information is in the form but not in the document, or vice-versa. Your primary goal is to verify the information that is present in both.
        6. Return a JSON object with the verification results. The JSON object should have the following format:
        {{
            "nameMatch": boolean,
            "panMatch": boolean,
            "dobMatch": boolean,
            "aadhaarMatch": boolean
        }}
        """

        # Call the Gemini API
        for i in range(3):
            try:
                model = genai.GenerativeModel('gemini-1.5-flash-latest')
                response = model.generate_content([prompt, image])

                import json

# ... (rest of the imports)

# ... (inside the ocr function)

                # Extract the JSON from the response
                cleaned_json = response.text.replace('```json', '').replace('```', '').strip()
                verification_results = json.loads(cleaned_json)

                return jsonify({
                    'ocrText': response.text, # For debugging purposes
                    'verificationResults': verification_results
                })
            except Exception as e:
                if i < 2: # if not the last attempt
                    time.sleep(1) # wait for 1 second before retrying
                    continue
                else:
                    raise e

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
