import React, {useEffect, useState} from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Chip,
    Tooltip
} from "@material-tailwind/react";
import {
    EyeIcon,
    ArrowPathIcon
} from "@heroicons/react/24/solid";
import axios from 'axios';
import DoctorAccountForm from './DoctorAccountForm';
import {toast} from "react-toastify";
const DoctorAccountManagement = () => {
    const [open, setOpen] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [doctorList, setDoctorList] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        pageSize: 10,
        totalPages: 0,
        totalRecords: 0
    });
    const [searchTerm, setSearchTerm] = useState('');

    // Form data state
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        name: '',
        specialtyName: '',
        hospitalName: '',
        phone: '',
        bio: '',
        yearsOfExperience: '',
        imageUrl:''

    });
    // State để preview ảnh
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});
        const handleFileChange = (e) => {
            const file = e.target.files[0];
            if (file) {
                // Kiểm tra kích thước file (ví dụ: giới hạn 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    alert('File size should not exceed 5MB');
                return;
            }

            // Kiểm tra định dạng file
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                alert('Only JPEG, PNG, and GIF files are allowed');
                return;
            }

                setFormData((prevFormData) => ({
                    ...prevFormData,
                    imageUrl: e.target.files[0]
                }));
        }
    };

    // Fetch doctor list
    const fetchDoctorList = async (page = 1, search = '') => {
        try {
            const response = await axios.get(`${__DOMAINNAME__}api/getlistdoctors`, {
                params: {
                    page,
                    pageSize: pagination.pageSize,
                    searchTerm: search
                }
            });

            setDoctorList(response.data.doctors);
            setPagination(prev => ({
                ...prev,
                currentPage: page,
                totalPages: response.data.totalPages,
                totalRecords: response.data.totalRecords
            }));
        } catch (error) {
            console.error('Error fetching doctors:', error);
            alert('Failed to fetch doctor list');
        }
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    // Fetch doctor details
    const fetchDoctorDetails = async (doctorId) => {
        try {
            const response = await axios.get(`${__DOMAINNAME__}api/getdoctordetail/${doctorId}`);
            setSelectedDoctor(response.data);
            setDetailsOpen(true);
        } catch (error) {
            console.error('Error fetching doctor details:', error);
            alert('Failed to fetch doctor details');
        }
    };

    // Change doctor status
    const changeDoctorStatus = async (doctorId) => {
        try {
            const response = await axios.post(`${__DOMAINNAME__}api/changedoctorstatuss`, { doctorId });

            // Optimistic update
            setDoctorList(prevList =>
                prevList.map(doctor =>
                    doctor.doctor_id === doctorId
                        ? {...doctor, status: doctor.status === 'active' ? 'inactive' : 'active'}
                        : doctor
                )
            );

            // Optional: Refresh list or show success message
            toast.success(response.data.message || 'Doctor status updated successfully');
        } catch (error) {
            console.error('Error changing doctor status:', error);

            // Detailed error handling
            const errorMessage = error.response?.data?.error || 'Failed to change doctor status';
            toast.error(errorMessage);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Username validation
        if (!formData.username) newErrors.username = 'Username is required';
        if (formData.username.length < 4) newErrors.username = 'Username must be at least 4 characters';

        // Password validation
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) newErrors.email = 'Email is required';
        if (formData.email && !emailRegex.test(formData.email)) newErrors.email = 'Invalid email format';

        // Name validation
        if (!formData.name) newErrors.name = 'Name is required';

        // Phone validation
        const phoneRegex = /^0\d{9}$/;
        if (!formData.phone) newErrors.phone = 'Phone is required';
        if (formData.phone && !phoneRegex.test(formData.phone)) newErrors.phone = 'Invalid phone number';

        // Experience validation
        if (!formData.yearsOfExperience) newErrors.yearsOfExperience = 'Years of experience is required';
        if (formData.yearsOfExperience && (isNaN(formData.yearsOfExperience) || formData.yearsOfExperience < 0)) {
            newErrors.yearsOfExperience = 'Invalid years of experience';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                const formDataToSubmit = new FormData();

                // Append all form data to FormData
                Object.keys(formData).forEach(key => {
                    // Special handling for numeric fields
                    if (key === 'yearsOfExperience') {
                        formDataToSubmit.append(key, parseInt(formData[key], 10));
                    } else {
                        formDataToSubmit.append(key, formData[key]);
                    }
                });

                const response = await axios.post(`${__DOMAINNAME__}api/createprofiledoctor`, formDataToSubmit, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                console.log('API Response:', response.data);

                alert('Doctor account created successfully');
                setOpen(false);
                fetchDoctorList(pagination.currentPage, searchTerm);
            } catch (error) {
                // Error handling remains the same as in your original code
                console.error('Error details:', {
                    response: error.response,
                    request: error.request,
                    message: error.message
                });

                if (error.response) {
                    console.error('Error response data:', error.response.data);
                    console.error('Error response status:', error.response.status);
                    console.error('Error response headers:', error.response.headers);

                    alert(error.response.data.message || 'Failed to create doctor account');
                } else if (error.request) {
                    console.error('No response received:', error.request);
                    alert('No response from server. Please check your network connection.');
                } else {
                    console.error('Error setting up request:', error.message);
                    alert('Error setting up the request');
                }
            }
        }
    };

    // Lifecycle
    useEffect(() => {
        fetchDoctorList();
    }, []);
    const handleSpecialtyChange = (value) => {
        setFormData(prevState => ({
            ...prevState,
            specialtyName: value
        }));
    };

    const handleHospitalChange = (value) => {
        setFormData(prevState => ({
            ...prevState,
            hospitalName: value
        }));
    };
    // Render doctor details modal
    const renderDoctorDetailsModal = () => (
        <Dialog
            open={detailsOpen}
            handler={() => setDetailsOpen(false)}
            size="lg"
        >
            <DialogHeader>Doctor Details</DialogHeader>
            <DialogBody divider>
                {selectedDoctor && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <Typography variant="h6">Profile Image</Typography>
                            <img
                                src={selectedDoctor.image}
                                alt="Doctor Profile"
                                className="h-20 w-20 object-cover rounded-md"
                            />
                        </div>
                        <div>
                            <Typography variant="h6">Personal Information</Typography>
                            <p>Name: {selectedDoctor.name}</p>
                            <p>Email: {selectedDoctor.email}</p>
                            <p>Phone: {selectedDoctor.phone}</p>
                            <p>Years of Experience: {selectedDoctor.years_of_experience}</p>
                        </div>
                        <div>
                            <Typography variant="h6">Professional Details</Typography>
                            <p>Username: {selectedDoctor.username}</p>
                            <p>Specialty: {selectedDoctor.specialty_name}</p>
                            <p>Hospital: {selectedDoctor.hospital_name}</p>
                            <p>Status: {selectedDoctor.status}</p>
                        </div>
                        <div className="col-span-2">
                            <Typography variant="h6">Bio</Typography>
                            <p>{selectedDoctor.bio || 'No bio provided'}</p>
                        </div>

                    </div>
                )}
            </DialogBody>
            <DialogFooter>
                <Button
                    color="red"
                    onClick={() => setDetailsOpen(false)}
                >
                    Close
                </Button>
            </DialogFooter>
        </Dialog>
    );

    return (
        <Card className="w-full max-w-6xl mx-auto mt-10">
            <CardHeader
                color="blue"
                className="mb-4 p-6 flex justify-between items-center"
            >
                <Typography variant="h5" color="white">
                    Doctor Account Management
                </Typography>
                <div className="flex items-center space-x-10">
                    <label>Search doctors</label>
                    <Input

                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            fetchDoctorList(1, e.target.value);
                        }}
                    />
                    <Button
                        onClick={() => setOpen(true)}
                        color="green"
                    >
                        Create New Doctor Account
                    </Button>
                </div>
            </CardHeader>

            <CardBody>
                <table className="w-full min-w-max table-auto text-left">
                    <thead>
                    <tr>
                        {['ID','Name', 'Email', 'Phone', 'Experience', 'Status', 'Actions'].map((head) => (
                            <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                <Typography variant="small" className="font-normal leading-none opacity-70">
                                    {head}
                                </Typography>
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {doctorList.map((doctor, index) => {
                        const isLast = index === doctorList.length - 1;
                        const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                        return (
                            <tr key={doctor.doctor_id}>
                                <td className={classes}>
                                    <Typography variant="small" className="font-normal">
                                        {doctor.doctor_id}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography variant="small" className="font-normal">
                                        {doctor.name}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography variant="small" className="font-normal">
                                        {doctor.email}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography variant="small" className="font-normal">
                                        {doctor.phone}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography variant="small" className="font-normal">
                                        {doctor.years_of_experience} years
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Chip
                                        color={doctor.status === 'active' ? 'green' : 'red'}
                                        value={doctor.status}
                                        className="text-xs"
                                    />
                                </td>
                                <td className={classes}>
                                    <div className="flex items-center space-x-2">
                                        <Tooltip content="View Details">
                                            <Button
                                                size="sm"
                                                variant="text"
                                                onClick={() => fetchDoctorDetails(doctor.doctor_id)}
                                            >
                                                <EyeIcon className="h-4 w-4"/>
                                            </Button>
                                        </Tooltip>
                                        <Tooltip content="Change Status">
                                            <Button
                                                size="sm"
                                                variant="text"
                                                color="blue"
                                                onClick={() => changeDoctorStatus(doctor.doctor_id)}
                                            >
                                                <ArrowPathIcon className="h-4 w-4"/>
                                            </Button>
                                        </Tooltip>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="flex justify-between items-center mt-4">
                    <Typography variant="small">
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </Typography>
                    <div className="flex space-x-2">
                        <Button
                            size="sm"
                            disabled={pagination.currentPage === 1}
                            onClick={() => fetchDoctorList(pagination.currentPage - 1, searchTerm)}
                            className='bg-blue-500'
                        >
                            Previous
                        </Button>
                        <Button
                            size="sm"
                            disabled={pagination.currentPage === pagination.totalPages}
                            onClick={() => fetchDoctorList(pagination.currentPage + 1, searchTerm)}
                            className='bg-blue-500'
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </CardBody>

            {/* Create/Edit Doctor Account Modal */}
            <Dialog
                open={open}
                handler={() => setOpen(false)}
                size="xxl"
                className="flex items-center justify-center min-h-screen"
            >
                <DialogHeader className="text-xl font-bold">
                    Create Doctor Account
                </DialogHeader>
                <DialogBody
                    divider
                    className="max-w-lg w-full p-4 space-y-4"
                >
                    <DoctorAccountForm
                        formData={formData}
                        errors={errors}
                        handleInputChange={handleInputChange}
                        handleSpecialtyChange={handleSpecialtyChange}
                        handleHospitalChange={handleHospitalChange}
                        handleFileChange={handleFileChange}
                    />
                </DialogBody>
                <DialogFooter className="flex justify-end space-x-2">
                    <Button
                        variant="text"
                        color="red"
                        onClick={() => setOpen(false)}
                        className="mr-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        color="green"
                        onClick={handleSubmit}
                    >
                        Create Account
                    </Button>
                </DialogFooter>
            </Dialog>


            {/* Doctor Details Modal */}
            {renderDoctorDetailsModal()}
        </Card>
    );
};

export default DoctorAccountManagement;
