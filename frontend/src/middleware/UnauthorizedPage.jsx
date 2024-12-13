// src/components/pages/UnauthorizedPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-red-600 mb-4">Bạn không có quyền truy cập</h1>
            <p className="text-lg text-gray-700 mb-6">
                Bạn không có quyền truy cập trang này. Vui lòng đăng nhập để tiếp tục.
            </p>
            <Link
                to={'/'}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
                Go to Home
            </Link>
        </div>
    );
};

export default UnauthorizedPage;
