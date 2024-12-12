import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUpPage from './components/SignUpPage';
import LoginPage from './components/LoginPage';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/SignUpPage" element={<SignUpPage />} />
                <Route path="/LoginPage" element={<LoginPage />} />
            </Routes>
        </Router>
    );
};

export default App;
