Copyrequire('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Successfully connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));

// Create schema
const ContactSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    date: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', ContactSchema);

// Handle form submissions
app.post('/submit', async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();
        console.log('New form submission:', req.body);
        res.status(200).json({ message: 'Form submitted successfully' });
    } catch (error) {
        console.error('Error saving form:', error);
        res.status(500).json({ message: 'Error submitting form' });
    }
});

// Use port 5000 instead
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please try a different port.`);
    } else {
        console.error('Server error:', error);
    }
});