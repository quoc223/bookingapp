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
    Tooltip
} from "@material-tailwind/react";
import {
    EyeIcon,
    ArrowPathIcon
} from "@heroicons/react/24/solid";

export const PatientAccounts = () => {
    const [pagination, setPagination] = useState({
        currentPage: 1,
        pageSize: 10,
        totalPages: 0,
        totalRecords: 0
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [patientList, setPatientList] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);

    // Fetch patient list
    const fetchPatientList = async (page = 1, search = '') => {
        try {
            const response = await axios.get(`${__DOMAINNAME__}api/getpatientlistaccount`, {
                params: {
                    page,
                    pageSize: pagination.pageSize,
                    searchTerm: search
                }
            });

            setPatientList(response.data.patients);
            setPagination(prev => ({
                ...prev,
                currentPage: page,
                totalPages: response.data.totalPages,
                totalRecords: response.data.totalRecords
            }));
        } catch (error) {
            console.error('Error fetching patients:', error);
            alert('Failed to fetch patient list');
        }
    };

    // Change user role
    const changeUserRole = async (accountId, newRole) => {
        try {
            await axios.post(`${__DOMAINNAME__}api/changeroleaccount`, {
                accountId,
                newRole
            });

            // Refresh the list after changing role
            fetchPatientList(pagination.currentPage, searchTerm);
        } catch (error) {
            console.error('Error changing user role:', error);
            alert('Failed to change user role');
        }
    };

    // Fetch patient details (placeholder for future implementation)
    const fetchPatientDetails = (patientId) => {
        // Implement patient details fetching logic
        console.log(`Fetching details for patient ${patientId}`);
    };

    useEffect(() => {
        fetchPatientList();
    }, []);

    return (
        <Card className="w-full max-w-6xl mx-auto mt-10">
            <CardHeader
                color="blue"
                className="mb-4 p-6 flex justify-between items-center"
            >
                <Typography variant="h5" color="white">
                    Patient Account Management
                </Typography>
                <div className="flex items-center space-x-10">
                    <label>Search patients</label>
                    <Input
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            fetchPatientList(1, e.target.value);
                        }}
                    />
                    <Button
                        color="green"
                    >
                        Create New Patient Account
                    </Button>
                </div>
            </CardHeader>

            <CardBody>
                <table className="w-full min-w-max table-auto text-left">
                    <thead>
                    <tr>
                        {['ID', 'Name', 'Email', 'Phone', 'Role', 'Status', 'Actions'].map((head) => (
                            <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                <Typography variant="small" className="font-normal leading-none opacity-70">
                                    {head}
                                </Typography>
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {patientList.map((patient, index) => {
                        const isLast = index === patientList.length - 1;
                        const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                        return (
                            <tr key={patient.patient_id}>
                                <td className={classes}>
                                    <Typography variant="small" className="font-normal">
                                        {patient.patient_id}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography variant="small" className="font-normal">
                                        {patient.name}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography variant="small" className="font-normal">
                                        {patient.email}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography variant="small" className="font-normal">
                                        {patient.phone}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Chip
                                        color="blue"
                                        value={patient.role}
                                        className="text-xs"
                                    />
                                </td>
                                <td className={classes}>
                                    <Chip
                                        color={patient.status === 'active' ? 'green' : 'red'}
                                        value={patient.status}
                                        className="text-xs"
                                    />
                                </td>
                                <td className={classes}>
                                    <div className="flex items-center space-x-2">
                                        <Tooltip content="View Details">
                                            <Button
                                                size="sm"
                                                variant="text"
                                                onClick={() => fetchPatientDetails(patient.patient_id)}
                                            >
                                                <EyeIcon className="h-4 w-4"/>
                                            </Button>
                                        </Tooltip>
                                        <Tooltip content="Change Role">
                                            <Button
                                                size="sm"
                                                variant="text"
                                                color="blue"
                                                onClick={() => changeUserRole(patient.patient_id, 'doctor')}
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
                            onClick={() => fetchPatientList(pagination.currentPage - 1, searchTerm)}
                            className='bg-blue-500'
                        >
                            Previous
                        </Button>
                        <Button
                            size="sm"
                            disabled={pagination.currentPage === pagination.totalPages}
                            onClick={() => fetchPatientList(pagination.currentPage + 1, searchTerm)}
                            className='bg-blue-500'
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};
