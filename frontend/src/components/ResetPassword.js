import React, { useState } from 'react';
import axios from 'axios';
import "./ResetPassword.css"; 

const ResetPassword = ({ email: initialEmail }) => {
    const [email, setEmail] = useState(initialEmail || '');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/ResetPassword', { email, otp, newPassword });
            alert(response.data.message); // Success message
        } catch (err) {
          alert(err.response?.data?.error || 'Something went wrong'); // Error message
        }
    };

    return (
        <div className="reset-container">
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
            {!initialEmail && (
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                )}
                <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Enter confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type="submit">Reset Password</button>
            </form>
        </div>
    );
};

export default ResetPassword;
