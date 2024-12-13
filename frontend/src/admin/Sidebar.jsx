import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    HomeIcon,
    UserIcon,
    CogIcon,
    CalendarIcon,
    BanknotesIcon,
    ChevronDownIcon,
    ChevronUpIcon,
} from "@heroicons/react/24/solid";
import {
    Card,
    Typography,
    List,
    ListItem,
    ListItemPrefix,
    IconButton,
    Collapse,
} from "@material-tailwind/react";

const menuItems = [
    {
        icon: <HomeIcon className="h-5 w-5" />,
        label: "Dashboard",
        path: "/admin/dashboard",
    },
    {
        icon: <UserIcon className="h-5 w-5" />,
        label: "Quản Lý Người Dùng",
        subItems: [
            { label: "Quản Lý Tài Khoản Bệnh Nhân", path: "/admin/users/patients" },
            { label: "Quản Lý Tài Khoản Bác Sĩ", path: "/admin/users/doctors" },
            { label: "Phân Quyền Người Dùng", path: "/admin/users/roles" },
        ],
    },
    {
        icon: <CogIcon className="h-5 w-5" />,
        label: "Quản Lý Dịch Vụ",
        subItems: [
            { label: "Quản Lý Chuyên Khoa", path: "/services/specialties" },
            { label: "Quản Lý Gói Khám", path: "/services/packages" },
        ],
    },
    {
        icon: <CalendarIcon className="h-5 w-5" />,
        label: "Quản Lý Lịch Hẹn",
        subItems: [
            { label: "Theo Dõi Lịch Hẹn", path: "/appointments/track" },
            { label: "Phân Tích Lịch Hẹn", path: "/appointments/analyze" },
        ],
    },
    {
        icon: <BanknotesIcon className="h-5 w-5" />,
        label: "Quản Lý Tài Chính",
        subItems: [
            { label: "Thống Kê Doanh Thu", path: "/finance/revenue" },
            { label: "Xuất Báo Cáo Tài Chính", path: "/finance/reports" },
        ],
    },
];

export function Sidebar() {
    const location = useLocation();
    const [openMenu, setOpenMenu] = useState(
        menuItems.reduce((acc, item) => {
            acc[item.label] = false;
            return acc;
        }, {})
    );

    const toggleMenu = (label) => {
        setOpenMenu((prev) => ({
            ...prev,
            [label]: !prev[label],
        }));
    };

    return (
        <div className="w-[280px] h-full fixed top-0 left-0 z-50 bg-white">
            <Card className="h-full w-full p-4">
                <div className="mb-2 flex items-center justify-between">
                    <Typography variant="h5" color="blue-gray">
                        Hospital Admin
                    </Typography>
                </div>

                <div className="mb-4 flex items-center space-x-4">
                    <img
                        src="https://placehold.co/50x50"
                        alt="Profile"
                        className="rounded-full w-12 h-12"
                    />
                    <div>
                        <Typography variant="h6" color="blue-gray">
                            Nick Gonzalez
                        </Typography>
                        <Typography variant="small" color="gray" className="font-normal">
                            Department Admin
                        </Typography>
                    </div>
                </div>

                <List>
                    {menuItems.map((item) => (
                        <div key={item.label}>
                            <ListItem
                                selected={location.pathname === item.path}
                                className={`${
                                    location.pathname === item.path
                                        ? "bg-blue-500 text-white hover:bg-blue-600"
                                        : "hover:bg-blue-gray-50"
                                }`}
                            >
                                <ListItemPrefix>
                                    {item.icon}
                                </ListItemPrefix>
                                <Link to={item.path} className="w-full">{item.label}</Link>
                                {item.subItems && (
                                    <IconButton
                                        variant="text"
                                        color="blue-gray"
                                        onClick={() => toggleMenu(item.label)}
                                        className="ml-auto"
                                    >
                                        {openMenu[item.label] ? (
                                            <ChevronUpIcon className="h-5 w-5" />
                                        ) : (
                                            <ChevronDownIcon className="h-5 w-5" />
                                        )}
                                    </IconButton>
                                )}
                            </ListItem>
                            {item.subItems && (
                                <Collapse open={openMenu[item.label]}>
                                    <List className="ml-6">
                                        {item.subItems.map((subItem) => (
                                            <Link to={subItem.path} key={subItem.label} className="w-full">
                                                <ListItem
                                                    selected={location.pathname === subItem.path}
                                                    className={`${
                                                        location.pathname === subItem.path
                                                            ? "bg-blue-500 text-white hover:bg-blue-500"
                                                            : "hover:bg-blue-gray-50"
                                                    }`}
                                                >
                                                    {subItem.label}
                                                </ListItem>
                                            </Link>
                                        ))}
                                    </List>
                                </Collapse>
                            )}
                        </div>
                    ))}
                </List>
            </Card>
        </div>
    );
}
