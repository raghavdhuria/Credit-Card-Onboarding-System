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
    if 'files' not in request.files:
        return jsonify({'error': 'No files part'}), 400
    
    files = request.files.getlist('files')
    if not files or all(file.filename == '' for file in files):
        return jsonify({'error': 'No selected files'}), 400

    try:
        # Get form data
        form_data = request.form
        name = form_data.get('name', '')
        pan = form_data.get('pan', '')
        dob = form_data.get('dob', '')
        aadhaar = form_data.get('aadhaar', '')

        # Prepare the images for Gemini
        images = []
        for file in files:
            try:
                image = Image.open(io.BytesIO(file.read()))
                images.append(image)
            except Exception as e:
                return jsonify({'error': f'Could not process file {file.filename}: {str(e)}'}), 400

        # Create the prompt for Gemini
        prompt = f'''
        You are a highly intelligent document verification expert. Your critical task is to analyze the provided images and verify them against the given form data. Your primary responsibility is to prevent fraud by detecting non-authentic documents.

        Form Data:
        - Name: {name}
        - PAN Card: {pan}
        - Date of Birth: {dob}
        - Aadhaar Card: {aadhaar}

        **Crucial Instructions:**

        1.  **Document Authenticity Verification (Most Important Task):**
            *   You MUST first determine if the uploaded images are genuine, government-issued Aadhar and PAN cards from India.
            *   **Reject any document that is not an official, printed card.** This includes, but is not limited to:
                *   Handwritten text on paper.
                *   Information typed on a plain document.
                *   Digital mockups or screenshots that are not photos of a physical card.
            *   A genuine document will have specific holograms, emblems (like the Government of India emblem), and a specific layout. While you can't see holograms, you should look for the overall structure and appearance of an official card.
            *   If you determine that **either** of the documents is not an authentic government-issued card, you must set the `isDocumentAuthentic` flag to `false`.

        2.  **Information Extraction and Matching:**
            *   If and only if you have verified that **both** documents appear authentic, proceed to the next steps.
            *   Identify which image is the Aadhar card and which is the PAN card.
            *   Extract the Name, PAN Number, Date of Birth, and Aadhaar Number from the images.
            *   Compare the extracted information with the provided form data. A match is successful if the value from the form is present in the corresponding document.

        3.  **JSON Output:**
            *   You MUST return a JSON object with the verification results.
            *   If `isDocumentAuthentic` is `false`, the other match fields (`nameMatch`, `panMatch`, etc.) should also be `false`, as the information cannot be trusted.
            *   The JSON object must have the following format:
                ```json
                {{
                    "nameMatch": boolean,
                    "panMatch": boolean,
                    "dobMatch": boolean,
                    "aadhaarMatch": boolean,
                    "isDocumentAuthentic": boolean
                }}
                ```
        '''

        # Call the Gemini API
        for i in range(3):
            try:
                model = genai.GenerativeModel('gemini-2.5-pro')
                response = model.generate_content([prompt] + images)

                # Log the raw response from Gemini
                print("Gemini API response:", response.text)

                # Extract the JSON from the response
                cleaned_json = response.text.replace('```json', '').replace('```', '').strip()
                verification_results = json.loads(cleaned_json)

                return jsonify({
                    'ocrText': response.text, # For debugging purposes
                    'verificationResults': verification_results
                })
            except (json.JSONDecodeError, KeyError) as e:
                if i < 2: # if not the last attempt
                    time.sleep(1) # wait for 1 second before retrying
                    continue
                else:
                    # If parsing fails after retries, return an error
                    return jsonify({'error': 'Failed to parse Gemini response', 'details': str(e)}), 500
            except Exception as e:
                if i < 2: # if not the last attempt
                    time.sleep(1) # wait for 1 second before retrying
                    continue
                else:
                    raise e

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)