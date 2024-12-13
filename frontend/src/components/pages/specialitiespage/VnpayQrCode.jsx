import React from 'react';

const VnpayQrCode = () => {
    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <img src="/api/placeholder/300/300" alt="VNPAY QR Code" className="w-64 h-64" />
            </div>
            <p className="text-gray-600">Quét mã QR để thanh toán</p>
        </div>
    );
};

export default VnpayQrCode;
