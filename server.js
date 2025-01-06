const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

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
    role: { type: String, enum: ['student', 'instructor'], required: true },// Added role
    resetToken: { type: String },
    resetTokenExpiry: { type: Date }
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

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'chandangowda2422@gmail.com', // Replace with your email
      pass: 'wwji mwpy wqlj brjs', // Replace with your email password or app password
  },
});

// Step 1: Generate OTP and send email
app.post('/api/ForgotPassword', async (req, res) => {
  try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Generate OTP and set token expiry
      const otp = crypto.randomInt(1000, 9999); // Random 4-digit OTP
      const resetTokenExpiry = Date.now() + 3 * 60 * 1000; // 3 minutes expiry

      user.resetToken = otp.toString();
      user.resetTokenExpiry = resetTokenExpiry;
      await user.save();

      // Send email with OTP
      const mailOptions = {
          from: 'chandangowda2422@gmail.com',
          to: user.email,
          subject: 'Password Reset OTP',
          text: `Your OTP for password reset is: ${otp}. It is valid for 3 minutes.`,
      };

      await transporter.sendMail(mailOptions);
      return res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
  }
});

// Step 2: Verify OTP and reset password
app.post('/api/ResetPassword', async (req, res) => {
  try {
      const { email, otp, newPassword } = req.body;
      const user = await User.findOne({ email, resetToken: otp, resetTokenExpiry: { $gt: Date.now() } });

      if (!user) {
          return res.status(400).json({ error: 'Invalid or expired OTP' });
      }

      // Hash the new password and save it
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.resetToken = undefined; // Clear the reset token
      user.resetTokenExpiry = undefined;
      await user.save();

      res.json({ message: 'Password reset successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
  }
});


app.listen(5000, () => console.log('Server running on port 5000'));
