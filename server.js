const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myDatabaseName', { useNewUrlParser: true, useUnifiedTopology: true });

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    mobile: {type: String, require: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'instructor'], required: true } // Added role
});

const User = mongoose.model('User', studentSchema);



// Register
app.post('/api/SignUpPage', async (req, res) => {
    try {
        const { name, mobile, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const student = new User({ name, mobile, email, password: hashedPassword, role: 'student' });

        await student.save();
        res.status(201).json({ message: 'Student registered successfully' });
    } catch (error) {
        
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            res.status(400).json({ error: `${field} already exists` });
        } else {
            res.status(500).json({ error: 'Server error' });
        }
    }
});


// Login
app.post('/api/LoginPage', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ message: 'Login successful', token, role: user.role });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});


app.listen(5000, () => console.log('Server running on port 5000'));
