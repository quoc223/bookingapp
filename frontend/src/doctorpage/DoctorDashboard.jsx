import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button,
    Avatar
} from "@material-tailwind/react";
import {
    UsersIcon,
    ClipboardDocumentListIcon,
    CalendarDaysIcon
} from "@heroicons/react/24/solid";

import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

export default function DoctorDashboard() {
    const [patientData, setPatientData] = useState([]);
    const [patientStats, setPatientStats] = useState({
        total_patients: 0,
        today_patients: 0
    });

    const [appointmentStats, setAppointmentStats] = useState({
        total_appointments: 0,
        today_appointments: 0
    });

    const [todayAppointments, setTodayAppointments] = useState([]);
    const [nextPatient, setNextPatient] = useState(null);
    const [patientsSummary, setPatientsSummary] = useState({
        total_patients: 0,
        new_patients_percentage: 0,
        old_patients_percentage: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${__DOMAINNAME__}api/getdailypatient`);
                const result = response.data;
                if (result.data) {
                    setPatientData(result.data);
                } else {
                    setPatientData([]);
                }
            } catch (error) {
                console.error("Error fetching patient data:", error);
                setPatientData([]);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [
                    patientStatsRes,
                    appointmentStatsRes,
                    todayAppointmentsRes,
                    nextPatientRes,
                    patientsSummaryRes
                ] = await Promise.all([
                    axios.get(`${__DOMAINNAME__}api/patient-stats`),
                    axios.get(`${__DOMAINNAME__}api/appointment-stats`),
                    axios.get(`${__DOMAINNAME__}api/today-appointments`),
                    axios.get(`${__DOMAINNAME__}api/next-appointment`),
                    axios.get(`${__DOMAINNAME__}api/patients-summary`)
                ]);

                setPatientStats(patientStatsRes.data);
                setAppointmentStats(appointmentStatsRes.data);
                setTodayAppointments(todayAppointmentsRes.data);
                setNextPatient(nextPatientRes.data);
                setPatientsSummary(patientsSummaryRes.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="p-6 w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                    <CardHeader
                        color="blue"
                        className="relative h-20 flex items-center justify-center"
                    >
                        <UsersIcon className="h-10 w-10 text-white"/>
                    </CardHeader>
                    <CardBody>
                        <Typography variant="h5" color="blue-gray" className="mb-2">
                            Tổng số bệnh nhân
                        </Typography>
                        <Typography color="blue" className="text-3xl font-bold">
                            {patientStats.total_patients || 0}+
                        </Typography>
                        <Typography variant="small" color="gray" className="mt-2">
                            Hôm nay: {patientStats.today_patients || 0}
                        </Typography>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader
                        color="green"
                        className="relative h-20 flex items-center justify-center"
                    >
                        <CalendarDaysIcon className="h-10 w-10 text-white"/>
                    </CardHeader>
                    <CardBody>
                        <Typography variant="h5" color="blue-gray" className="mb-2">
                            Bệnh nhân hôm nay
                        </Typography>
                        <Typography color="green" className="text-3xl font-bold">
                            {patientStats.today_patients || 0}
                        </Typography>
                        <Typography variant="small" color="gray" className="mt-2">
                            {new Date().toLocaleDateString()}
                        </Typography>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader
                        color="purple"
                        className="relative h-20 flex items-center justify-center"
                    >
                        <ClipboardDocumentListIcon className="h-10 w-10 text-white"/>
                    </CardHeader>
                    <CardBody>
                        <Typography variant="h5" color="blue-gray" className="mb-2">
                            Lịch hẹn hôm nay
                        </Typography>
                        <Typography color="purple" className="text-3xl font-bold">
                            {appointmentStats.today_appointments || 0}
                        </Typography>
                        <Typography variant="small" color="gray" className="mt-2">
                            {new Date().toLocaleDateString()}
                        </Typography>
                    </CardBody>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader color="blue" className="relative h-56">
                        <Typography variant="h5" color="white" className="p-4">
                            Tóm tắt bệnh nhân {new Date().toLocaleDateString()}
                        </Typography>
                    </CardHeader>
                    <CardBody>
                        <div className="flex justify-between items-center">
                            <div className="flex flex-col items-center">
                                <Typography color="blue" className="text-2xl font-bold">
                                    {patientsSummary.new_patients_percentage || 0}%
                                </Typography>
                                <Typography variant="small" color="gray">
                                    Bệnh nhân mới
                                </Typography>
                            </div>
                            <div className="flex flex-col items-center">
                                <Typography color="amber" className="text-2xl font-bold">
                                    {patientsSummary.old_patients_percentage || 0}%
                                </Typography>
                                <Typography variant="small" color="gray">
                                    Bệnh nhân cũ
                                </Typography>
                            </div>
                            <div className="flex flex-col items-center">
                                <Typography color="indigo" className="text-2xl font-bold">
                                    100%
                                </Typography>
                                <Typography variant="small" color="gray">
                                    Tổng số bệnh nhân
                                </Typography>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader color="green" className="relative h-56">
                        <Typography variant="h5" color="white" className="p-4">
                            Lịch hẹn hôm nay
                        </Typography>
                    </CardHeader>
                    <CardBody>
                        <div className="space-y-4">
                            {todayAppointments.length > 0 ? todayAppointments.map((appointment, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <div className="flex items-center space-x-4">
                                        <Avatar
                                            src="https://placehold.co/40x40"
                                            alt={appointment.patient_name || 'Không có tên'}
                                        />
                                        <div>
                                            <Typography variant="h6">
                                                {appointment.patient_name || 'Bệnh nhân không rõ'}
                                            </Typography>
                                            <Typography variant="small" color="gray">
                                                {appointment.service_name || 'Không có dịch vụ'}
                                            </Typography>
                                        </div>
                                    </div>
                                    <Typography variant="small" color="gray">
                                        {new Date(appointment.appointment_date).toLocaleTimeString() || 'Không có thời gian'}
                                    </Typography>
                                </div>
                            )) : (
                                <Typography variant="small" color="gray">
                                    Không có lịch hẹn hôm nay
                                </Typography>
                            )}
                            <Button className="mt-4" color="blue" variant="text">
                                Xem tất cả
                            </Button>
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader color="purple" className="relative h-56">
                        <Typography variant="h5" color="white" className="p-4">
                            Chi tiết bệnh nhân tiếp theo
                        </Typography>
                    </CardHeader>
                    <CardBody>
                        {nextPatient ? (
                            <>
                                <div className="flex items-center mb-4 space-x-4">
                                    <Avatar
                                        src="https://placehold.co/60x60"
                                        alt={nextPatient.name || 'Không có tên'}
                                    />
                                    <div>
                                        <Typography variant="h6">{nextPatient.name || 'Không rõ'}</Typography>
                                        <Typography variant="small" color="gray">
                                            {nextPatient.service_name || 'Không có dịch vụ'}
                                        </Typography>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <Typography variant="small" color="gray">Ngày sinh</Typography>
                                        <Typography variant="paragraph" color="blue-gray">
                                            {new Date(nextPatient.date_of_birth).toLocaleDateString() || '-'}
                                        </Typography>
                                    </div>
                                    <div>
                                        <Typography variant="small" color="gray">Giới tính</Typography>
                                        <Typography variant="paragraph" color="blue-gray">
                                            {nextPatient.gender || '-'}
                                        </Typography>
                                    </div>
                                    <div>
                                        <Typography variant="small" color="gray">Số điện thoại</Typography>
                                        <Typography variant="paragraph" color="blue-gray">
                                            {nextPatient.phone || '-'}
                                        </Typography>
                                    </div>
                                    <div>
                                        <Typography variant="small" color="gray">Lịch hẹn</Typography>
                                        <Typography variant="paragraph" color="blue-gray">
                                            {new Date(nextPatient.appointment_date).toLocaleString() || '-'}
                                        </Typography>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <Typography variant="paragraph" color="blue-gray" className="mb-2">
                                        Tiền sử bệnh
                                    </Typography>
                                    <div className="flex space-x-2">
                                        {nextPatient.medical_history
                                            ? nextPatient.medical_history.split(',').map((condition, index) => (
                                                <span key={index}
                                                      className="bg-yellow-500 text-white px-2 py-1 rounded">
                                              {condition.trim()}
                                          </span>
                                            ))
                                            : 'Không có tiền sử bệnh'}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <Typography variant="paragraph" color="gray">
                                Không có lịch hẹn tiếp theo
                            </Typography>
                        )}
                    </CardBody>
                </Card>
            </div>
            <DailyChart data={patientData}/>
        </div>


    );
}

const DailyChart = ({data}) => {
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
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="date"/>
                        <YAxis/>
                        <Tooltip/>
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
