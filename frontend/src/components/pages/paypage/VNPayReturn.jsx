import React, { useEffect, useState } from 'react';
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { useLocation } from "react-router-dom";
import { Check, X, FileText, Clock, Calendar, CreditCard, ArrowLeft } from 'lucide-react';


// VNPayReturn Component
const VNPayReturn = () => {
    const [paymentStatus, setPaymentStatus] = useState(null); // State lưu thông tin thanh toán
    const location = useLocation(); // Lấy thông tin URL hiện tại

    useEffect(() => {
        // Phân tích dữ liệu từ query parameters
        const queryParams = new URLSearchParams(location.search);

        // Kiểm tra và lấy giá trị query params
        const success = queryParams.get("success") === "true";
        const message = queryParams.get("message") || "Không xác định";
        const paymentId = queryParams.get("payment_id");
        const appointmentId = queryParams.get("appointment_id");
        const amount = queryParams.get("amount");
        const status = queryParams.get("status");
        const transactionRef = queryParams.get("transaction_ref");
        const bankCode = queryParams.get("bank_code");
        const paymentDate = queryParams.get("payment_date");
        const transactionNo = queryParams.get("transaction_no");
        const vnpayResponseCode = queryParams.get("vnpay_response_code");

        // Xây dựng state từ dữ liệu nhận được
        if (success) {
            setPaymentStatus({
                status: "success",
                amount: `${parseFloat(amount).toLocaleString()} VNĐ`,
                orderId: transactionRef,
                paymentTime: new Date(decodeURIComponent(paymentDate)).toLocaleString("vi-VN"),
                bankCode: bankCode,
                transactionNo: transactionNo,
                message: "Thanh toán thành công!",
            });
        } else {
            setPaymentStatus({
                status: "failed",
                message: decodeURIComponent(message),
            });
        }
    }, [location]);

    if (!paymentStatus) {
        // Hiển thị giao diện tải nếu paymentStatus chưa được thiết lập
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Typography variant="h5" className="text-gray-500">
                    Đang tải thông tin thanh toán...
                </Typography>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <Card className="max-w-2xl mx-auto">
                    <CardBody className="p-8">
                        <div className="text-center mb-8">
                            {/* Icon success / failed */}
                            <div className="flex justify-center mb-4">
                                {paymentStatus.status === "success" ? (
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                        <Check className="w-8 h-8 text-green-500" />
                                    </div>
                                ) : (
                                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                        <X className="w-8 h-8 text-red-500" />
                                    </div>
                                )}
                            </div>
                            <Typography
                                variant="h4"
                                className={`text-blue-gray-800 mb-2 ${
                                    paymentStatus.status === "success" ? "text-green-500" : "text-red-500"
                                }`}
                            >
                                {paymentStatus.status === "success"
                                    ? "Thanh toán thành công"
                                    : "Thanh toán thất bại"}
                            </Typography>
                            <Typography className="text-gray-600">{paymentStatus.message}</Typography>
                        </div>

                        {paymentStatus.status === "success" && (
                            <>
                                <div className="bg-blue-50 rounded-xl p-6 mb-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <Typography className="font-medium text-gray-700">
                                            Số tiền thanh toán
                                        </Typography>
                                        <Typography className="text-xl font-bold text-blue-gray-800">
                                            {paymentStatus.amount}
                                        </Typography>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-gray-700">
                                            <FileText className="w-5 h-5 text-blue-500" />
                                            <span className="min-w-[140px]">Mã đơn hàng:</span>
                                            <span className="font-medium">{paymentStatus.orderId}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-700">
                                            <Clock className="w-5 h-5 text-blue-500" />
                                            <span className="min-w-[140px]">Thời gian:</span>
                                            <span className="font-medium">{paymentStatus.paymentTime}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-700">
                                            <CreditCard className="w-5 h-5 text-blue-500" />
                                            <span className="min-w-[140px]">Ngân hàng:</span>
                                            <span className="font-medium">{paymentStatus.bankCode}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-700">
                                            <Calendar className="w-5 h-5 text-blue-500" />
                                            <span className="min-w-[140px]">Mã giao dịch:</span>
                                            <span className="font-medium">{paymentStatus.transactionNo}</span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default VNPayReturn;
