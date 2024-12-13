import React, { useEffect, useState } from 'react';
import {
    Card,
    Typography,
    List,
    ListItem,
    ListItemPrefix,
} from "@material-tailwind/react";
import {
    PresentationChartBarIcon,
    CalendarIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    InboxIcon,
    PowerIcon,
    DocumentTextIcon,
    ChartBarIcon
} from "@heroicons/react/24/solid";
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import axios from "axios";

export function DoctorSidebar() {
    const [profile, setProfile] = useState({
        name: '',
        avatarUrl: '',
        specialty: '',
        hospitalName: '',
        hospitalAddress: ''
    });
    const navigate = useNavigate();

    // Fetch the doctor profile when the component mounts
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = Cookies.get('token');
                const response = await axios.get(`${import.meta.env.VITE_DOMAINNAME}api/getdoctorprofilecookies`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const doctorData = response.data[0];  // Assuming the response is an array and we need the first element

                setProfile({
                    name: doctorData.doctor_name,
                    avatarUrl: doctorData.image || 'https://placehold.co/100x100',  // Fallback avatar if not provided
                    specialty: doctorData.specialty_name,
                    hospitalName: doctorData.hospital_name,
                    hospitalAddress: doctorData.hospital_address
                });
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, []);

    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleLogout = async () => {
        try {
            // Clear token from cookies
            Cookies.remove('token');

            // Call the logout API (optional, but recommended for session handling)
            const logoutUrl = `${import.meta.env.VITE_DOMAINNAME}api/logout`;

            await axios.post(logoutUrl, {}, {
                withCredentials: true, // Ensures cookies are sent with the request
            });

            // Redirect to login page
            navigate('/doctor/login');

            // Optionally reload the page to reset state completely
            window.location.reload();
        } catch (error) {
            console.error('Error during logout:', error.response?.data || error.message);
            // Fallback navigation in case of error
            navigate('/doctor/login');
        }
    };

    return (
        <Card className="h-full w-64 p-4 shadow-xl">
            <div className="mb-6 flex flex-col items-center">
                <img
                    src={profile.avatarUrl}
                    alt="Doctor Avatar"
                    className="mb-2 h-24 w-24 rounded-full"
                />
                <Typography variant="h5" color="blue-gray">
                    {profile.name || 'Dr. Marttin Deo'}
                </Typography>
                <Typography variant="small" color="gray" className="font-normal">
                    {profile.specialty || 'Specialty'}
                </Typography>
                <Typography variant="small" color="gray" className="font-normal">
                    {profile.hospitalName || 'Hospital Name'}
                </Typography>
                <Typography variant="small" color="gray" className="font-normal">
                    {profile.hospitalAddress || 'Hospital Address'}
                </Typography>
            </div>
            <List>
                {/* Dashboard */}
                <ListItem
                    onClick={() => handleNavigation('/doctor/dashboard')}
                    className="cursor-pointer"
                >
                    <ListItemPrefix>
                        <PresentationChartBarIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Dashboard
                </ListItem>

                {/* Profile Management (UC1) */}
                <ListItem
                    onClick={() => handleNavigation('/doctor/profile-management')}
                    className="cursor-pointer"
                >
                    <ListItemPrefix>
                        <UserCircleIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Profile Management
                </ListItem>

                {/* Schedule Management (UC2) */}
                <ListItem
                    onClick={() => handleNavigation('/doctor/schedule-management')}
                    className="cursor-pointer"
                >
                    <ListItemPrefix>
                        <CalendarIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Schedule Management
                </ListItem>

                {/* Patients */}
                <ListItem
                    onClick={() => handleNavigation('/doctor/patients')}
                    className="cursor-pointer"
                >
                    <ListItemPrefix>
                        <UserCircleIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Patients
                </ListItem>

                {/* Blog Management (UC5) */}
                <ListItem
                    onClick={() => handleNavigation('/doctor/blog-management')}
                    className="cursor-pointer"
                >
                    <ListItemPrefix>
                        <DocumentTextIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Blog Management
                </ListItem>

                {/* Reporting (UC6) */}
                <ListItem
                    onClick={() => handleNavigation('/doctor/reporting')}
                    className="cursor-pointer"
                >
                    <ListItemPrefix>
                        <ChartBarIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Reporting
                </ListItem>

                {/* Messages */}
                <ListItem
                    onClick={() => handleNavigation('/doctor/messages')}
                    className="cursor-pointer"
                >
                    <ListItemPrefix>
                        <InboxIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Messages
                </ListItem>

                {/* Settings */}
                <ListItem
                    onClick={() => handleNavigation('/doctor/settings')}
                    className="cursor-pointer"
                >
                    <ListItemPrefix>
                        <Cog6ToothIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Settings
                </ListItem>

                {/* Logout */}
                <ListItem
                    onClick={() => handleLogout()}
                    className="cursor-pointer"
                >
                    <ListItemPrefix>
                        <PowerIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Logout
                </ListItem>
            </List>
        </Card>
    );
}
