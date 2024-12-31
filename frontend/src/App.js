import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUpPage from './components/SignUpPage';
import LoginPage from './components/LoginPage';
import InstructorProfile from './components/InstructorProfile';
import ForgotPassword from './components/ForgotPassword';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/SignUpPage" element={<SignUpPage />} />
                <Route path="/LoginPage" element={<LoginPage />} />
                <Route path="/InstructorProfile" element={<InstructorProfile />} />
                <Route path="/ForgotPassword" element={<ForgotPassword/>} />
            </Routes>
        </Router>
    );
};

export default App;
