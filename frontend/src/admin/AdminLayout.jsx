import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
    Navbar,
    Typography,
    IconButton,
} from "@material-tailwind/react";
import {
    Bars3Icon,
    MagnifyingGlassIcon,
    UserCircleIcon,
    BellIcon,
} from "@heroicons/react/24/solid";
import { Sidebar } from './Sidebar';

export default function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className={`transition-all duration-300 ${isSidebarOpen ? 'w-[280px]' : 'w-0 overflow-hidden'}`}>
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300`}>
                {/* Top Navigation */}
                <Navbar className="sticky top-0 z-40 flex justify-between items-center px-4 py-2">
                    <div className="flex items-center">
                        <IconButton
                            variant="text"
                            color="blue-gray"
                            onClick={toggleSidebar}
                        >
                            <Bars3Icon className="h-6 w-6" />
                        </IconButton>

                        <div className="ml-4 relative flex items-center">
                            <MagnifyingGlassIcon className="absolute left-3 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-3 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <IconButton variant="text" color="blue-gray">
                            <BellIcon className="h-6 w-6" />
                        </IconButton>

                        <div className="flex items-center space-x-2">
                            <UserCircleIcon className="h-8 w-8 text-blue-gray-500" />
                            <Typography variant="small" color="blue-gray" className="font-medium">
                                Nick Gonzalez
                            </Typography>
                        </div>
                    </div>
                </Navbar>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
