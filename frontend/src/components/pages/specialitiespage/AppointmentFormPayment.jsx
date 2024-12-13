import React, { useState } from 'react';
import axios from 'axios';
import {Button, Dialog, DialogBody, DialogFooter, DialogHeader} from '@material-tailwind/react';
import { useParams, useNavigate } from 'react-router-dom';

const AppointmentPaymentForm = () => {
    const [paymentMethod, setPaymentMethod] = useState('later');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [openDialog, setOpenDialog] = useState(false);

    const { appointmentId } = useParams();
    const navigate = useNavigate();

    const bookingFee = 200000;
    const consultationFee = 0;
    const totalFee = consultationFee + bookingFee;

    const createPaymentUrl = async () => {
        setIsLoading(true);
        setError(null);

        if (!appointmentId) {
            setError('Không tìm thấy ID lịch hẹn. Vui lòng kiểm tra lại.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${__DOMAINNAME__}payments/create_payment_url`, {
                amount: bookingFee,
                language: 'vn',
                bankCode: '',
                appointmentId: appointmentId,
            });

            if (response.data.paymentUrl) {
                window.location.href = response.data.paymentUrl;
            } else {
                setError('Không thể tạo URL thanh toán');
                setIsLoading(false);
            }
        } catch (err) {
            setError('Đã xảy ra lỗi khi tạo URL thanh toán');
            console.error('Error:', err.response?.data || err.message);
            setIsLoading(false);
        }
    };

    const handleSubmitOnlinePayment = (e) => {
        e.preventDefault();
        createPaymentUrl();
    };

    const handleSubmitLaterPayment = (e) => {
        e.preventDefault();
        setSuccessMessage('Lịch hẹn của bạn đã được đặt thành công. Hãy đến phòng khám vào giờ đã chọn.');
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        navigate('/'); // Redirect to appointments page after closing dialog
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Thanh toán</h2>

            {/* Radio Button Selection */}
            <div className="space-y-4 mb-6">
                <div className="flex items-center">
                    <input
                        id="paymentLater"
                        name="payment"
                        type="radio"
                        checked={paymentMethod === 'later'}
                        onChange={() => setPaymentMethod('later')}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <label htmlFor="paymentLater" className="ml-2 block text-sm font-medium text-gray-700">
                        Thanh toán tại phòng khám
                    </label>
                </div>
                <div className="flex items-center">
                    <input
                        id="paymentNow"
                        name="payment"
                        type="radio"
                        checked={paymentMethod === 'now'}
                        onChange={() => setPaymentMethod('now')}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <label htmlFor="paymentNow" className="ml-2 block text-sm font-medium text-gray-700">
                        Thanh toán trực tuyến ngay
                    </label>
                </div>
            </div>

            {/* Fee Details */}
            <div className="bg-gray-50 p-4 rounded-md mb-6">
                <div className="flex justify-between">
                    <div>
                        <p className="text-sm text-gray-600 mt-1">Phí đặt lịch</p>
                        <p className="font-semibold mt-2 text-gray-800">Tổng cộng</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-800 mt-1">{bookingFee.toLocaleString()} VND</p>
                        <p className="font-semibold mt-2 text-blue-600">{totalFee.toLocaleString()} VND</p>
                    </div>
                </div>
            </div>

            {/* Conditional Rendering Based on Payment Method */}
            {paymentMethod === 'now' ? (
                <form onSubmit={handleSubmitOnlinePayment}>
                    {error && (
                        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full px-4 py-2 font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            isLoading
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                        }`}
                    >
                        {isLoading ? 'Đang xử lý...' : 'Thanh toán ngay'}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleSubmitLaterPayment}>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 font-medium text-white bg-green-600 hover:bg-green-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                        Xác nhận đặt lịch
                    </button>
                </form>
            )}

            {/* Success Dialog */}
            <Dialog open={openDialog} handler={handleCloseDialog}>
                <DialogHeader>Đặt lịch thành công</DialogHeader>
                <DialogBody>
                    <p className="text-gray-800">{successMessage}</p>
                </DialogBody>
                <DialogFooter>
                    <Button variant="gradient" color="green" onClick={handleCloseDialog}>
                        OK
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default AppointmentPaymentForm;
