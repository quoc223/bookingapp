import React, { useState } from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    Input,
    Textarea,
    Button,
    Typography
} from "@material-tailwind/react";
import {
    UserCircle2,
    Phone,
    Mail,
    Building2,
    MessageCircle,
    Send
} from "lucide-react";
import axios from 'axios';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        facility: '',
        message: ''
    });

    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({
        success: false,
        error: false,
        message: ''
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSubmitStatus({ success: false, error: false, message: '' });
        const apiUrl = import.meta.env.VITE_DOMAINNAME;
        try {
            const response = await axios.post(`${__DOMAINNAME__}api/createdoctorcontact`, {
                name: formData.name,
                specialty_id: 1, // You might want to make this dynamic
                email: formData.email,
                phone: formData.phone,
                message: formData.message
            });

            setSubmitStatus({
                success: true,
                error: false,
                message: 'Gửi thông tin thành công!'
            });

            // Reset form after successful submission
            setFormData({
                name: '',
                phone: '',
                email: '',
                facility: '',
                message: ''
            });
        } catch (error) {
            setSubmitStatus({
                success: false,
                error: true,
                message: 'Đã có lỗi xảy ra. Vui lòng thử lại.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
            <Card className="w-full max-w-lg shadow-2xl rounded-xl overflow-hidden">
                <CardHeader
                    color="blue"
                    className="mb-4 grid h-36 place-items-center bg-gradient-to-r from-blue-500 to-blue-700"
                >
                    <div className="text-center">
                        <Typography variant="h3" color="white" className="text-3xl font-bold mb-2">
                            Hợp tác cùng Prescripto
                        </Typography>
                        <Typography color="white" className="text-sm opacity-80">
                            Điền thông tin để chúng tôi liên hệ hỗ trợ
                        </Typography>
                    </div>
                </CardHeader>
                <CardBody className="p-6">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        {/* Name Input */}
                        <div className="space-y-2">
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Người liên hệ
                            </label>
                            <div className="relative">
                                <Input
                                    id="name"
                                    type="text"
                                    icon={<UserCircle2 className="text-blue-500"/>}
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="border-blue-200 focus:border-blue-500 transition-all duration-300"
                                />
                            </div>
                        </div>

                        {/* Phone Input */}
                        <div className="space-y-2">
                            <label
                                htmlFor="phone"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Số điện thoại
                            </label>
                            <Input
                                id="phone"
                                type="tel"
                                icon={<Phone className="text-blue-500"/>}
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className="border-blue-200 focus:border-blue-500 transition-all duration-300"
                            />
                        </div>

                        {/* Email Input */}
                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Địa chỉ email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                icon={<Mail className="text-blue-500"/>}
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="border-blue-200 focus:border-blue-500 transition-all duration-300"
                            />
                        </div>

                        {/* Facility Input */}
                        <div className="space-y-2">
                            <label
                                htmlFor="facility"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Cơ sở y tế
                            </label>
                            <Input
                                id="facility"
                                icon={<Building2 className="text-blue-500"/>}
                                value={formData.facility}
                                onChange={handleChange}
                                className="border-blue-200 focus:border-blue-500 transition-all duration-300"
                            />
                        </div>

                        {/* Message Textarea */}
                        <div className="space-y-2">
                            <label
                                htmlFor="message"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Lý do
                            </label>
                            <Textarea
                                id="message"
                                icon={<MessageCircle className="text-blue-500"/>}
                                value={formData.message}
                                onChange={handleChange}
                                required
                                className="border-blue-200 focus:border-blue-500 transition-all duration-300"
                                rows={4}
                            />
                        </div>

                        {/* Submit Status Messages */}
                        {submitStatus.success && (
                            <Typography color="green" className="text-center bg-green-50 p-2 rounded-lg">
                                {submitStatus.message}
                            </Typography>
                        )}
                        {submitStatus.error && (
                            <Typography color="red" className="text-center bg-red-50 p-2 rounded-lg">
                                {submitStatus.message}
                            </Typography>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            color="blue"
                            disabled={loading}
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transition-all duration-300 transform hover:scale-105"
                        >
                            {loading ? 'Đang gửi...' : 'Gửi thông tin'}
                            {!loading && <Send size={20}/>}
                        </Button>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
};

export default ContactForm;
