
# Credit Card Onboarding Portal

This project is a full-stack web application for a credit card onboarding portal. It includes a React frontend, a Node.js backend, and a Python OCR service.

## How to Run the Application

### Prerequisites

- Node.js and npm
- Python and pip
- MongoDB
- Tesseract

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install the dependencies:**
    ```bash
    npm install
    ```

3.  **Start the backend server:**
    ```bash
    npm start
    ```
    The server will start on `http://localhost:5301`.

### Python OCR Service Setup

1.  **Navigate to the Python OCR service directory:**
    ```bash
    cd backend/python-ocr-service
    ```

2.  **Install the Python dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Start the Python OCR service:**
    ```bash
    python app.py
    ```
    The service will start on `http://localhost:5001`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install the dependencies:**
    ```bash
    npm install
    ```

3.  **Start the frontend development server:**
    ```bash
    npm start
    ```
    The application will open in your browser at `http://localhost:3000`.

## How to Use the Application

1.  **Sign Up:** Create a new account on the sign-up page.
2.  **Sign In:** Log in with your credentials.
3.  **Select a Category:** On the chatbot page, select a rewards category from the dropdown menu.
4.  **Apply for a Credit Card:** You will be redirected to the application form. The category you selected will be displayed.
5.  **Fill out the Form:** Fill in all the required details in the application form.
6.  **Upload Documents:** Upload the necessary documents for verification.
7.  **Submit:** Submit your application.

## Important Notes

- Make sure you have MongoDB installed and running.
- You need to have Tesseract installed on your system for the OCR service to work. You can find installation instructions here: [https://github.com/tesseract-ocr/tesseract](https://github.com/tesseract-ocr/tesseract)
- The `Indian_banks_card_Dataset.xlsx` file in the root directory is a placeholder. Please replace it with the actual file.
