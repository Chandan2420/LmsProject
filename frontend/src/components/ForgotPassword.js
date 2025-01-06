import React, { useState } from 'react';
import axios from 'axios';
import "./ForgottenPassword.css";

const ForgotPassword = ({ onOtpSent }) => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/ForgotPassword', { email });
            alert(response.data.message); // Success message
        } catch (err) {
            alert(err.response?.data?.error || 'Something went wrong'); // Error message
        }
    };

    return (
        <div className="forgot-container">
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Send OTP</button>
            </form>
        </div>
    );
};

export default ForgotPassword;
