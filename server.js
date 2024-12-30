const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads")); // Serve uploaded files statically



// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myDatabaseName', { useNewUrlParser: true, useUnifiedTopology: true });

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    mobile: {type: String, require: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'instructor'], required: true } // Added role
});

const InstructorSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    profilePicture: { type: String }, 
    institution: { type: String },
    specialization: { type: String },
    experience: { type: Number },
    biography: { type: String },
    linkedin: { type: String },
    createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', studentSchema); 
const Instructor = mongoose.model('Instructor', InstructorSchema);

// Multer Configuration for File Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); // Folder to store files
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
    },
  });
  
  const upload = multer({ storage });

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

app.post("/api/InstructorProfile", upload.single("profilePicture"), async (req, res) => {
    try {
      const { fullName, email, phone, institution, specialization, experience, biography, linkedin,} = req.body;
  
      // Create new instructor profile
      const newInstructor = new Instructor({
        fullName,
        email,
        phone,
        profilePicture: req.file ? req.file.path : null, // Save file path if uploaded
        institution,
        specialization,
        experience,
        biography,
        linkedin,
      });
  
      await newInstructor.save();
      res.status(201).json({ message: "Instructor profile created successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create instructor profile." });
    }
  });


app.listen(5000, () => console.log('Server running on port 5000'));
