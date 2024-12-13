import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardHeader,
    CardBody,
    Input,
    Checkbox,
    Button,
    Typography,
    Alert,
} from "@material-tailwind/react";
import axios from "axios";
import { toast } from "react-toastify";

const LoginDashboard = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Consolidated input change handler
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null); // Clear previous errors

        try {
            // Validate inputs before submission
            if (!formData.email || !formData.password) {
                throw new Error('Email and password are required');
            }

            const { data } = await axios.post(`${__DOMAINNAME__}api/login/admin`, formData, {
                withCredentials: true
            });

            // Success handling
            toast.success(data.message || 'Login successful');

            // Improved navigation and state reset
            navigate('/admin    ', { replace: true });
        } catch (error) {
            // Centralized error handling
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Login failed. Please try again.';

            setError(errorMessage);
            toast.error(errorMessage);

            console.error('Login error:', error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <Card className="w-full max-w-sm">
                <CardHeader
                    color="blue"
                    className="flex justify-center py-4"
                >
                    <Typography variant="h5" color="white">
                        Dashboard Login
                    </Typography>
                </CardHeader>
                <CardBody className="px-6 py-4">
                    {error && (
                        <Alert color="red" className="mb-4">
                            {error}
                        </Alert>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block mb-2">Email</label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                autoFocus
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2">Password</label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Checkbox
                                id="remember-me"
                                label="Remember me"
                                color="blue"
                            />
                        </div>
                        <Button
                            type="submit"
                            color="blue"
                            fullWidth
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Login"}
                        </Button>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
};

export default LoginDashboard;
