import React from 'react';
import { DoctorSidebar } from './DoctorSidebar';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
    return (
        <div className="flex h-screen">
            <DoctorSidebar />
            <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
                <Outlet />
            </main>
        </div>
    );
}
