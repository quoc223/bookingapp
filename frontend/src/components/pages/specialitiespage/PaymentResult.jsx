import React from 'react';

const PaymentResult = ({ success, message, appointmentId }) => {
    return (
        <div className="flex flex-col items-center space-y-6 bg-white p-6 rounded-lg shadow-md">
            {success ? (
                <div className="text-green-500">
                    <svg
                        className="w-16 h-16 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <h2 className="text-2xl font-medium">Thanh toán thành công</h2>
                </div>
            ) : (
                <div className="text-red-500">
                    <svg
                        className="w-16 h-16 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <h2 className="text-2xl font-medium">Thanh toán không thành công</h2>
                </div>
            )}
            <p className="text-gray-600">{message}</p>
            {appointmentId && (
                <p className="text-gray-600">
                    Mã đặt lịch: <span className="font-medium">{appointmentId}</span>
                </p>
            )}
        </div>
    );
};

export default PaymentResult;
