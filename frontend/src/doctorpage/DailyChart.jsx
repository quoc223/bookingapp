import React, {useEffect, useState} from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { Card, CardBody, Typography } from "@material-tailwind/react";
const DailyChart = ({ data }) => {


    // Check if data is valid, fallback to an empty array if not
    const formattedData = (data || []).map(item => ({
        date: new Date(item.appointment_date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short'
        }),
        patientCount: item.patient_count
    }));

    return (
        <Card className="w-full max-w-4xl mx-auto mt-4">
            <CardBody>
                <Typography variant="h5" color="blue-gray" className="mb-4">
                    Daily Patient Count
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={formattedData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="patientCount"
                            stroke="#3B82F6"
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardBody>
        </Card>
    );
};
export default function MonthChart() {
    const [patientData, setPatientData] = useState([]);

    useEffect(() => {
        // Fetch data from your API
        const fetchData = async () => {
            try {
                const response = await fetch(`${__DOMAINNAME__}api/getdailypatient`);
                const result = await response.json();

                // Check if data is available in result.data
                if (result.data) {
                    setPatientData(result.data);
                } else {
                    setPatientData([]); // Fallback to empty array if no data is returned
                }
            } catch (error) {
                console.error("Error fetching patient data:", error);
                setPatientData([]); // Fallback to empty array on error
            }
        };
        fetchData();
    }, []);

    return <DailyChart data={patientData} />;
}
