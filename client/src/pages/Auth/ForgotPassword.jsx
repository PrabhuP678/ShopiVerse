import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import '../../public/ForgotPassword.css';

const ForgotPassword = () => {
    const [formData, setFormData] = useState({
        email: '',
        newPassword: '',
        answer: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.email || !formData.newPassword || !formData.answer) {
            toast.error('Please fill out all fields', {
                position: 'top-center',
                duration: 3000,
            });
            return;
        }

        setLoading(true);

        try {
            const apiUrl = process.env.REACT_APP_API;
            if (!apiUrl) {
                throw new Error('API URL is not defined');
            }

            const result = await axios.post(`${apiUrl}/api/v1/auth/forgot-password`, formData);

            if (result.data.success) {
                toast.success(result.data.message, {
                    position: 'top-center',
                    duration: 3000,
                });
                navigate('/');
            } else {
                toast.error(result.data.message, {
                    position: 'top-center',
                    duration: 3000,
                });
            }
        } catch (error) {
            console.error('Error during password reset request:', error);
            toast.error(error.response?.data?.message || 'Something went wrong', {
                position: 'top-center',
                duration: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="forgot-password-container">
                <form className="forgot-password-form" onSubmit={handleSubmit}>
                    <h1 className="mb-4">Forgot Password</h1>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="answer" className="form-label">Security Answer</label>
                        <input
                            type="text"
                            className="form-control"
                            id="answer"
                            name="answer"
                            value={formData.answer}
                            onChange={handleChange}
                            required
                            placeholder="Enter the answer to your security question"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="newPassword" className="form-label">New Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="newPassword"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                            placeholder="Enter your new password"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                </form>
            </div>
        </Layout>
    );
};

export default ForgotPassword;
