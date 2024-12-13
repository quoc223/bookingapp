import React, { useState } from 'react';
import {
    Card,
    Input,
    Button,
    Typography,
} from "@material-tailwind/react";
import axios from 'axios';
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { assets } from "../../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";
const Register = () => {
    const [formData, setFormData] = useState({ email: '', password: '', username: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_DOMAINNAME;
    const [errorMessage, setErrorMessage] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false); // State for Dialog visibility
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post(`${apiUrl}api/register`, formData);
            console.log('Registration successful:', data);
        } catch (error) {
            const message = error.response?.data?.message;
            setErrorMessage(message || 'Đã xảy ra lỗi. Vui lòng thử lại sau.');
            setIsDialogOpen(true);
            console.error('Registration error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handelClickRegister = () => {
        navigate('/login');
    }

    const closeDialog = () => {
        setIsDialogOpen(false);
        setErrorMessage('');
    };

    return (
        <div className="flex min-h-screen">
            {/* Left Section */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8">
                <Card className="w-full max-w-[440px] p-8 shadow-none">
                    {/* Logo */}
                    <div className="mb-8">
                        <img
                            src={assets.logo}
                            alt="Prescripto"
                            className="h-10"
                        />
                    </div>

                    {/* Sign Up Form */}
                    <Typography variant="h4" className="mb-2">
                        Đăng ký
                    </Typography>
                    <Typography variant="paragraph" color="blue-gray" className="mb-6">
                        Tạo tài khoản để bắt đầu hành trình chăm sóc sức khỏe của bạn.
                    </Typography>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Typography variant="small" color="blue-gray" className="font-medium">
                                Tên người dùng
                            </Typography>
                            <Input
                                name="username"
                                type="text"
                                placeholder="Enter your username"
                                value={formData.username}
                                onChange={handleChange}
                                className="!border !border-gray-300 focus:!border-blue-500"
                                labelProps={{ className: "hidden" }}
                                containerProps={{ className: "min-w-[100px]" }}
                            />
                        </div>

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
                            />
                        </div>

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

                        <Button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600"
                            disabled={loading}
                            onClick={handelClickRegister}
                        >
                            {loading ? "Đang xử lý..." : "Đăng ký"}
                        </Button>

                        <Typography
                            variant="small"
                            color="blue-gray"
                            className="text-center mt-4"
                        >
                            Bạn đã có tài khoản? {" "}
                            <Typography
                                as="a"
                                href="#login"
                                color="blue"
                                className="font-medium hover:underline"
                                onClick={handelClickRegister}
                            >
                                Đăng nhập
                            </Typography>
                        </Typography>
                    </form>
                </Card>
            </div>

            {/* Right Section */}
            <div className="hidden md:w-1/2 md:flex flex-col items-center justify-center bg-blue-500 p-8 text-white">
                <div className="max-w-lg text-center">
                    <Typography variant="h2" className="mb-4">
                        Chào Mừng Bạn Đến Với Prescripto!
                    </Typography>
                    <Typography className="mb-8 opacity-80">
                        Đăng ký tài khoản để bắt đầu sử dụng ứng dụng chăm sóc sức khỏe tốt nhất.
                    </Typography>

                    <img
                        src={assets.DoctorAvatar}
                        alt="Doctor Illustration"
                        className="w-full max-w-md mx-auto"
                    />
                </div>
            </div>
            <Dialog size="sm" active={isDialogOpen} toggler={closeDialog}>
                <DialogHeader>
                    <Typography color="blue-gray" variant="h5">
                        Lỗi
                    </Typography>
                </DialogHeader>
                <DialogBody>
                    <Typography color="blue-gray" variant="paragraph">
                        {errorMessage}
                    </Typography>
                </DialogBody>
                <DialogFooter>
                    <Button
                        color="blue"
                        buttonType="link"
                        onClick={closeDialog}
                        ripple="dark"
                    >
                        Đóng
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default Register;
