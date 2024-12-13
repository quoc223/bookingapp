import React, { useState, useEffect } from 'react';
import { Card, Typography, Input, Button, Dialog, DialogBody, DialogFooter } from "@material-tailwind/react";
import axios from 'axios';
import Cookies from 'js-cookie';
import { UserCircleIcon, HospitalIcon, StethoscopeIcon, MailIcon, PhoneIcon } from 'lucide-react';

export function ProfileManagement() {
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
        bio: '',
        years_of_experience: '',
        hospital_name: '',
        specialty_name: '',
        hospital_address: '',
        image: ''
    });

    const [dialog, setDialog] = useState({ open: false, title: '', message: '', isError: false });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDoctorProfile = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_DOMAINNAME}api/getdoctorprofilecookies`
                );

                // Map API response to component state
                const profileApiData = response.data[0]; // Assuming API returns an array
                setProfileData({
                    name: profileApiData.doctor_name || '',
                    email: profileApiData.doctor_email || '',
                    phone: profileApiData.doctor_phone || '',
                    bio: profileApiData.bio || '',
                    years_of_experience: profileApiData.years_of_experience || '',
                    hospital_name: profileApiData.hospital_name || '',
                    specialty_name: profileApiData.specialty_name || '',
                    hospital_address: profileApiData.hospital_address || '',
                    image: profileApiData.image || ''
                });
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching profile:', error);
                setDialog({
                    open: true,
                    title: 'Error',
                    message: 'Failed to load profile. Please try again.',
                    isError: true
                });
                setIsLoading(false);
            }
        };

        fetchDoctorProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleDialogClose = () => setDialog({ ...dialog, open: false });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = Cookies.get('token');
            await axios.put(
                `${import.meta.env.VITE_DOMAINNAME}api/doctor/profile`,
                {
                    name: profileData.name,
                    email: profileData.email,
                    phone: profileData.phone,
                    bio: profileData.bio,
                    years_of_experience: profileData.years_of_experience,
                    hospital_name: profileData.hospital_name,
                    specialty_name: profileData.specialty_name
                },
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );
            setDialog({
                open: true,
                title: 'Success',
                message: 'Profile updated successfully!',
                isError: false,
            });
        } catch (error) {
            console.error('Error updating profile:', error);
            setDialog({
                open: true,
                title: 'Error',
                message: error.response?.data?.message || 'Failed to update profile. Please try again.',
                isError: true,
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-pulse text-blue-500">
                    <StethoscopeIcon size={64} />
                    <Typography className="mt-4 text-center">Loading Profile...</Typography>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-blue-50 flex items-center justify-center p-6">
                <Card className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl overflow-hidden">
                    {/* Profile Image Section */}
                    {profileData.image && (
                        <div className="w-full flex justify-center pt-6">
                            <img
                                src={profileData.image}
                                alt="Doctor Profile"
                                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                            />
                        </div>
                    )}

                    <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-6">
                        <Typography variant="h4" color="white" className="flex items-center">
                            <UserCircleIcon className="mr-3"/> Profile Management
                        </Typography>
                    </div>
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-gray-700 mb-2">Full Name</label>
                                <Input
                                    name="name"
                                    value={profileData.name}
                                    onChange={handleInputChange}
                                    icon={<UserCircleIcon className="text-blue-500"/>}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                                <Input
                                    name="email"
                                    type="email"
                                    value={profileData.email}
                                    onChange={handleInputChange}
                                    icon={<MailIcon className="text-blue-500"/>}
                                />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-gray-700 mb-2">Phone Number</label>
                                <Input
                                    name="phone"
                                    value={profileData.phone}
                                    onChange={handleInputChange}
                                    icon={<PhoneIcon className="text-blue-500"/>}
                                />
                            </div>
                            <div>
                                <label htmlFor="years_of_experience" className="block text-gray-700 mb-2">Years of
                                    Experience</label>
                                <Input
                                    name="years_of_experience"
                                    type="number"
                                    value={profileData.years_of_experience}
                                    onChange={handleInputChange}
                                    icon={<StethoscopeIcon className="text-blue-500"/>}
                                />
                            </div>
                            <div>
                                <label htmlFor="hospital_name" className="block text-gray-700 mb-2">Hospital
                                    Name</label>
                                <Input
                                    name="hospital_name"
                                    value={profileData.hospital_name}
                                    onChange={handleInputChange}
                                    icon={<HospitalIcon className="text-blue-500"/>}
                                />
                            </div>
                            <div>
                                <label htmlFor="specialty_name" className="block text-gray-700 mb-2">Medical
                                    Specialty</label>
                                <Input
                                    name="specialty_name"
                                    value={profileData.specialty_name}
                                    onChange={handleInputChange}
                                    icon={<StethoscopeIcon className="text-blue-500"/>}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="bio" className="block text-gray-700 mb-2">Professional Bio</label>
                            <Input
                                name="bio"
                                value={profileData.bio}
                                onChange={handleInputChange}
                                variant="outlined"
                                className="mt-4"
                                rows={4}
                                multiline="true"
                            />
                        </div>

                        {profileData.hospital_address && (
                            <div className="mt-4">
                                <Typography variant="small" className="text-blue-gray-600 mb-2">
                                    Hospital Address
                                </Typography>
                                <div className="bg-blue-50 p-3 rounded-lg">
                                    <Typography>{profileData.hospital_address}</Typography>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                color="blue"
                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 transition-all duration-300"
                            >
                                Update Profile
                            </Button>
                        </div>
                    </form>

                </Card>
            </div>

            <Dialog
                open={dialog.open}
                handler={handleDialogClose}
                className={dialog.isError ? "bg-red-50" : "bg-green-50"}
            >
                <DialogBody>
                    <Typography variant="h5" color={dialog.isError ? "red" : "green"} className="mb-2">
                        {dialog.title}
                    </Typography>
                    <Typography>{dialog.message}</Typography>
                </DialogBody>
                <DialogFooter>
                    <Button
                        color={dialog.isError ? "red" : "green"}
                        onClick={handleDialogClose}
                    >
                        Close
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}
