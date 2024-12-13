import React, { useState } from 'react';
import {
    Card,
    Input,
    Button,
    Typography,
    Checkbox,
} from "@material-tailwind/react";
import axios from 'axios';
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import {assets} from "../assets/assets.js";
import {useNavigate} from "react-router-dom";
import { toast } from 'react-toastify'; // Assuming you're using react-toastify for notifications
import { Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";

const DoctorLogin = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false); // State for Dialog visibility
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_DOMAINNAME;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post(`${apiUrl}api/login/doctor`, formData, {
                withCredentials: true // Important for handling cookies
            });

            // Success notification
            toast.success(data.message || 'Login successful');

            // Navigate to home page
            navigate('/doctor/dashboard');
            window.location.reload();
        } catch (error) {
            // Error notification
            const message = error.response?.data?.message || 'Login failed';
            setErrorMessage(message);
            setIsDialogOpen(true); // Show dialog on error
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const closeDialog = () => {
        setIsDialogOpen(false);
        setErrorMessage('');
    };


    return (
        <div className="flex min-h-screen">
            {/* Left Section - Login Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8">
                <Card className="w-full max-w-[440px] p-8 shadow-none">
                    {/* Logo */}
                    <div className="mb-8">
                        <img
                            src={assets.logo}
                            alt="Filuick Pay"
                            className="h-10"
                        />
                    </div>

                    {/* Sign In Form */}
                    <Typography variant="h4" className="mb-2">
                        Đăng nhập Dành Cho Bác Sĩ
                    </Typography>
                    <Typography variant="paragraph" color="blue-gray" className="mb-6">
                        Chào mừng bạn trở lại! Vui lòng đăng nhập vào tài khoản của bạn
                    </Typography>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email Input */}
                        <div className="space-y-2">
                            <Typography variant="small" color="blue-gray" className="font-medium">
                                Email
                            </Typography>
                            <Input
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                className="!border !border-gray-300 focus:!border-blue-500"
                                labelProps={{ className: "hidden" }}
                                containerProps={{ className: "min-w-[100px]" }}
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <Typography variant="small" color="blue-gray" className="font-medium">
                                Mật khẩu
                            </Typography>
                            <div className="relative">
                                <Input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="!border !border-gray-300 focus:!border-blue-500"
                                    labelProps={{ className: "hidden" }}
                                    containerProps={{ className: "min-w-[100px]" }}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="h-5 w-5 text-blue-gray-400" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5 text-blue-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me and Forgot Password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Checkbox
                                    checked={rememberMe}
                                    onChange={() => setRememberMe(!rememberMe)}
                                    label="Nhớ mật khẩu"
                                    containerProps={{ className: "-ml-2.5" }}
                                    className="checked:bg-blue-500 checked:border-blue-500"
                                />
                            </div>
                            <Typography
                                as="a"
                                href="#"
                                color="blue"
                                className="font-medium hover:underline"
                            >
                                Quên mật khẩu?
                            </Typography>
                        </div>

                        {/* Login Button */}
                        <Button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600"
                            disabled={loading}
                        >
                            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </Button>

                        {/* Divider */}
                        <div className="relative py-3">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <Typography
                                    variant="small"
                                    className="bg-white px-4 text-blue-gray-500"
                                >
                                    OR
                                </Typography>
                            </div>
                        </div>

                        {/* Social Login Buttons */}
                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant="outlined"
                                className="flex items-center justify-center gap-2 normal-case"
                            >
                                <img
                                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                                    alt="Google"
                                    className="h-5 w-5"
                                />
                                Sign up with Google
                            </Button>
                            <Button
                                variant="outlined"
                                className="flex items-center justify-center gap-2 normal-case"
                            >
                                <img
                                    src="https://www.svgrepo.com/show/475647/facebook-color.svg"
                                    alt="Facebook"
                                    className="h-5 w-5"
                                />
                                Sign up with Facebook
                            </Button>
                        </div>

                        {/* Register Link */}

                    </form>
                </Card>
            </div>

            {/* Right Section - Welcome Message */}
            <div className="hidden md:w-1/2 md:flex flex-col items-center justify-center bg-blue-500 p-8 text-white">
                <div className="max-w-lg text-center">
                    <Typography variant="h2" className="mb-4">
                        Chào Mừng Bạn Đến Prescripto!
                    </Typography>
                    <Typography variant="h3" className="mb-4">
                        Đăng nhập để dùng ứng dụng{" "}
                    </Typography>
                    <Typography className="mb-8 opacity-80">
                        Đồng hành chăm sóc sức khỏe của bạn.
                    </Typography>

                    <img
                        src={assets.DoctorAvatar}
                        alt="Analytics Chart"
                        className="w-full max-w-md mx-auto"
                    />
                </div>
            </div>

            <Dialog
                open={isDialogOpen}
                handler={closeDialog}
                className="fixed bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-md p-4 bg-white rounded-lg shadow-xl z-50"
            >
                <DialogHeader className="text-red-600">Error</DialogHeader>
                <DialogBody>
                    <p>{errorMessage}</p>
                </DialogBody>
                <DialogFooter className="flex justify-center">
                    <Button
                        variant="outlined"
                        color="blue"
                        onClick={closeDialog}
                        className="w-full md:w-auto"
                    >
                        Close
                    </Button>
                </DialogFooter>
            </Dialog>

        </div>
    );
};

export default DoctorLogin;
