import React, { useState } from 'react';
import { Card, Typography, Input, Button } from "@material-tailwind/react";
import axios from 'axios';
import Cookies from 'js-cookie';

export default function Reporting() {
    const [patientStatistics, setPatientStatistics] = useState(null);
    const [revenueReport, setRevenueReport] = useState(null);
    const [dateRange, setDateRange] = useState({
        start_date: '',
        end_date: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDateRange(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const fetchPatientStatistics = async () => {
        try {
            const token = Cookies.get('token');
            const response = await axios.get(
                `${import.meta.env.VITE_DOMAINNAME}api/doctor/patient-statistics`,
                {
                    params: dateRange,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setPatientStatistics(response.data);
        } catch (error) {
            console.error('Error fetching patient statistics:', error);
            alert('Failed to fetch patient statistics');
        }
    };

    const fetchRevenueReport = async () => {
        try {
            const token = Cookies.get('token');
            const response = await axios.get(
                `${import.meta.env.VITE_DOMAINNAME}api/doctor/revenue-report`,
                {
                    params: dateRange,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setRevenueReport(response.data);
        } catch (error) {
            console.error('Error fetching revenue report:', error);
            alert('Failed to fetch revenue report');
        }
    };

    return (
        <div className="space-y-6">
            <Card className="w-full max-w-4xl mx-auto p-8">
                <Typography variant="h4" color="blue-gray" className="mb-4">
                    Reporting Dashboard
                </Typography>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <Input
                        name="start_date"
                        type="date"
                        label="Start Date"
                        value={dateRange.start_date}
                        onChange={handleInputChange}
                    />
                    <Input
                        name="end_date"
                        type="date"
                        label="End Date"
                        value={dateRange.end_date}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="flex space-x-4">
                    <Button color="blue" onClick={fetchPatientStatistics}>
                        Get Patient Statistics
                    </Button>
                    <Button color="green" onClick={fetchRevenueReport}>
                        Get Revenue Report
                    </Button>
                </div>

                {patientStatistics && (
                    <Card className="mt-6 p-4">
                        <Typography variant="h5">Patient Statistics</Typography>
                        <pre>{JSON.stringify(patientStatistics, null, 2)}</pre>
                    </Card>
                )}

                {revenueReport && (
                    <Card className="mt-6 p-4">
                        <Typography variant="h5">Revenue Report</Typography>
                        <pre>{JSON.stringify(revenueReport, null, 2)}</pre>
                    </Card>
                )}
            </Card>
        </div>
    );
}
