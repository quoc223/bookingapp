import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button,
    Input,
    Chip,
    Tooltip,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Select,
    Option
} from "@material-tailwind/react";
import {
    EyeIcon,
    ArrowPathIcon
} from "@heroicons/react/24/solid";

export const DoctorAccounts = () => {
    const [pagination, setPagination] = useState({
        currentPage: 1,
        pageSize: 10,
        totalPages: 0,
        totalRecords: 0
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [doctorList, setDoctorList] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [openRoleDialog, setOpenRoleDialog] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);

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

    // Open role change dialog
    const openRoleChangeDialog = (doctor) => {
        setSelectedDoctor(doctor);
        setSelectedRole(null);
        setOpenRoleDialog(true);
    };

    // Confirm role change
    const confirmRoleChange = async () => {
        if (!selectedDoctor || !selectedRole) {
            alert('Please select a doctor and a role');
            return;
        }

        try {
            await axios.post(`${__DOMAINNAME__}api/changeroleaccount`, {
                accountId: selectedDoctor.account_id,
                newRole: selectedRole
            });

            // Close dialog and refresh list
            setOpenRoleDialog(false);
            fetchDoctorList(pagination.currentPage, searchTerm);
        } catch (error) {
            console.error('Error changing user role:', error);
            alert('Failed to change user role');
        }
    };

    // Fetch doctor details (placeholder for future implementation)
    const fetchDoctorDetails = (doctorId) => {
        // Implement doctor details fetching logic
        console.log(`Fetching details for doctor ${doctorId}`);
    };

    useEffect(() => {
        fetchDoctorList();
    }, []);

    return (
        <>
            <Card className="w-full max-w-6xl mx-auto mt-10">
                <CardHeader
                    color="blue"
                    className="mb-4 p-6 flex justify-between items-center"
                >
                    <Typography variant="h5" color="white">
                        Thây Đổi Quyền Bác Sĩ
                    </Typography>
                    <Typography variant="h5" color="white">
                        Tìm Bác Sĩ
                    </Typography>
                    <div className="flex items-center space-x-10 w-7/12">
                        <Input
                            placeholder={'Search doctors'}
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                fetchDoctorList(1, e.target.value);
                            }}
                        />

                    </div>
                </CardHeader>

                <CardBody>
                    <table className="w-full min-w-max table-auto text-left">
                        <thead>
                        <tr>
                            {['ID', 'Name', 'Email', 'Phone', 'Experience', 'Username', 'Status', 'Actions'].map((head) => (
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
                                        <Typography variant="small" className="font-normal">
                                            {doctor.username}
                                        </Typography>
                                    </td>
                                    <td className={classes}>
                                        <Chip
                                            color={doctor.is_active ? 'green' : 'red'}
                                            value={doctor.is_active ? 'Active' : 'Inactive'}
                                            className="text-xs"
                                        />
                                    </td>
                                    <td className={classes}>
                                        <div className="flex items-center space-x-2">
                                            <Tooltip content="Change Role">
                                                <Button
                                                    size="sm"
                                                    variant="text"
                                                    color="blue"
                                                    onClick={() => openRoleChangeDialog(doctor)}
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
            </Card>

            {/* Role Change Dialog */}
            <Dialog open={openRoleDialog} handler={() => setOpenRoleDialog(false)}>
                <DialogHeader>Change User Role</DialogHeader>
                <DialogBody>
                    {selectedDoctor && (
                        <div className="mb-4">
                            <Typography variant="h6">
                                Change Role for {selectedDoctor.name}
                            </Typography>
                            <Select
                                label="Select Role"
                                onChange={(value) => setSelectedRole(value)}
                            >
                                <Option value="PATIENT">PATIENT</Option>
                                <Option value="DOCTOR">DOCTOR</Option>
                            </Select>
                        </div>
                    )}
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={() => setOpenRoleDialog(false)}
                        className="mr-2"
                    >
                        Cancel
                    </Button>
                    <Button
                        color="green"
                        onClick={confirmRoleChange}
                        disabled={!selectedRole}
                    >
                        Update Role
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
};
