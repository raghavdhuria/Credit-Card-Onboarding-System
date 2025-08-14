
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const xlsx = require('xlsx');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Import DB connection
const connectDB = require('./config/db');

// Import models
const User = require('./models/user.model');
const Application = require('./models/application.model');

const app = express();

// Connect to database
connectDB();

const port = process.env.PORT || 5301;

// In a real application, you should store this in an environment variable
const JWT_SECRET = process.env.JWT_SECRET;


app.use(cors())
app.use(express.json());


 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/test', (req, res) => {
  res.send('Test route is working!');
});

// --- Multer Configuration ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ storage: storage });

// --- Auth Middleware ---
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ message: 'Token is not valid' });
  }
};

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.get('/', (req, res) => {
  res.send('Credit Card Onboarding Portal Backend');
});



app.get('/api/categories', (req, res) => {
  try {
    // Read the Excel file
    const filePath = path.join(__dirname, 'Indian_Banks_Card_Dataset_Cleaned.xlsx');
    // console.log(filePath)
    const workbook = xlsx.readFile(filePath);

    // Take the first sheet
    console.log(workbook.SheetNames)
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    // console.log(sheetName)  
    // Convert sheet to JSON array of objects
    const data = xlsx.utils.sheet_to_json(worksheet);
    // console.log(data, ": data")
    // Extract the 'Rewards Category' values, filter out blanks/nulls, and deduplicate
    const categories = [
      ...new Set(
        data
          .map(item => item['Rewards Category']?.toString().trim())
          .filter(Boolean)
      )
    ];

    // console.log("Categories are:", categories);

    res.json(categories);

  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error reading data', error: error.message });
  }
});

app.get('/api/data', (req, res) => {
  try {
    const { category } = req.query;
    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }

    const filePath = path.join(__dirname, 'Indian_Banks_Card_Dataset_Cleaned.xlsx');
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    const filteredData = data.filter(item => item['Rewards Category'] === category);

    res.json(filteredData);

  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Error reading data', error: error.message });
  }
});

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

app.post('/api/chatbot', async (req, res) => {
  try {
    const { message } = req.body;

    const filePath = path.join(__dirname, 'Indian_Banks_Card_Dataset_Cleaned.xlsx');
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash"});

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: `You are a helpful chatbot for a credit card onboarding portal. Your primary function is to answer questions based on the provided data from an XLSX file. You can also answer general questions about finance, credit cards, debit cards, and other related topics. When a question is asked, first check if the answer can be found in the provided data. If it is, use that information to answer the question. If the question is not in the data, but is a general finance or card-related question, you can answer it. If the question is not related to finance or the provided data, you should respond with "I can only answer questions related to finance and the provided credit card data."

Here is the data: ${JSON.stringify(data)}

If the user greets you with "hi", "hello", or any other greeting, you should respond with "Hello! How can I help you with your credit card questions today?". Do not engage in any other small talk or conversation.` }],
        },
        {
          role: "model",
          parts: [{ text: "Great! I'm ready to help. What would you like to know?"}],
        },
      ],
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    let text = response.text();

    if (!text || text.trim() === '') {
      text = "I'm sorry, I don't have an answer for that. Please try asking another question.";
    }

    res.json({ reply: text });

  } catch (error) {
    console.error('Error with chatbot:', error);
    res.status(500).json({ message: 'Error processing your request', error: error.message });
  }
});

// --- Authentication Routes ---

// Sign Up
app.post('/api/signup', async (req, res) => {
  try {
    console.log('Signup request body:', req.body);
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    console.log('Existing user:', existingUser);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Hashed password:', hashedPassword);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });
    console.log('New user object:', newUser);

    // Save the user to the database
    await newUser.save();
    console.log('User saved successfully!');

    console.log('Sending signup success response:', { message: 'User created successfully!' });
    res.status(201).json({ message: 'User created successfully!' });
  } catch (error) {
    console.error('Error during signup:', error);
    console.log('Sending signup error response:', { message: 'Error creating user', error: error.message });
    res.status(400).json({ message: 'Error creating user', error: error.message });
  }
});



// Sign In
app.post('/api/signin', async (req, res) => {
  try {
    console.log('Signin request body:', req.body);
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    console.log('Found user:', user);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);
    if (!isMatch) {
      console.log('Sending signin error response:', { message: 'Invalid credentials' });
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create and assign a token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    console.log('Generated token:', token);

    console.log('Sending signin success response:', { token });
    res.json({ token });
  } catch (error) {
    console.error('Error during signin:', error);
    console.log('Sending signin error response:', { message: 'Server error', error: error.message });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// --- Application Route ---
app.post('/api/apply', auth, upload.single('document'), async (req, res) => {
  try {
    const { name, address, contact, dob, pan, aadhaar } = req.body;
    const documentPath = req.file.path;

    // Create a form data object to send to the python service
    const form = new FormData();
    form.append('file', fs.createReadStream(documentPath));
    form.append('name', name);
    form.append('pan', pan);
    form.append('dob', dob);
    form.append('aadhaar', aadhaar);

    // Call OCR service
    const ocrResponse = await axios.post('http://localhost:5001/ocr', form, {
      headers: {
        ...form.getHeaders()
      }
    });

    const { ocrText, verificationResults } = ocrResponse.data;

    // Create new application
    const newApplication = new Application({
      userId: req.user.id,
      name,
      address,
      contact,
      dob,
      pan,
      aadhaar,
      documentPath,
      ocrText,
      verificationResults
    });

    await newApplication.save();

    res.status(201).json({ message: 'Application submitted successfully!', application: newApplication });

  } catch (error) {
    console.error('Error during application submission:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
