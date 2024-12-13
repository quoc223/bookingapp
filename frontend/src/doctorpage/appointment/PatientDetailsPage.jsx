import React, { useState, useEffect } from 'react';
import {
    Card,
    Typography,
    Button,
    Dialog,
    DialogBody,
    DialogFooter,
    IconButton,
} from '@material-tailwind/react';
import { UserCircleIcon, CalendarIcon, DocumentTextIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const PatientDetailsPage = () => {
    const [patient, setPatient] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { patientId } = useParams();
    const navigate = useNavigate();

    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        fetchPatientDetails();
    }, [patientId]);

    const fetchPatientDetails = async () => {
        try {
            const response = await axios.get(`${__DOMAINNAME__}api/getpatient/${patientId}`, {
                withCredentials: true,
            });
            setPatient(response.data.patient);
            setAppointments(response.data.appointments);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching patient details:', err);
            setError('Không thể tải thông tin bệnh nhân. Vui lòng thử lại sau.');
            setOpenDialog(true);
            setLoading(false);
        }
    };

    const closeDialog = () => {
        setOpenDialog(false);
        if (!patient) navigate('/doctor/patients');
    };

    // Hàm để thay đổi trạng thái cuộc hẹn
    const updateAppointmentStatus = async (appointmentId, newStatus) => {
        try {
            const response = await axios.post(
                `${__DOMAINNAME__}api/updatestatusappointment`,
                { appointmentId, status: newStatus },
                { withCredentials: true }
            );
            fetchPatientDetails(); // Tải lại thông tin bệnh nhân và cuộc hẹn
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái cuộc hẹn:', error);
        }
    };

    if (loading) {
        return <div className="text-center text-gray-500 p-6">Đang tải thông tin bệnh nhân...</div>;
    }

    if (!patient) {
        return <div className="text-center text-gray-500 p-6">Không tìm thấy bệnh nhân</div>;
    }

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            {/* Dialog for Errors */}
            <Dialog open={openDialog} handler={closeDialog}>
                <DialogBody>{error}</DialogBody>
                <DialogFooter>
                    <Button color="red" onClick={closeDialog}>
                        Đóng
                    </Button>
                </DialogFooter>
            </Dialog>

            {/* Back Button */}
            <Button
                variant="text"
                className="flex items-center gap-2 text-cyan-500 hover:text-cyan-600 mb-6"
                onClick={() => navigate('/doctor/patients')}
            >
                <ArrowLeftIcon className="h-5 w-5" />
                Quay lại danh sách bệnh nhân
            </Button>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Patient Profile */}
                <Card className="p-6">
                    <div className="flex flex-col items-center">
                        <UserCircleIcon className="text-cyan-500 w-24 h-24 mb-4" />
                        <Typography variant="h5" className="font-bold text-gray-800">
                            {patient.name}
                        </Typography>
                        <Typography variant="small" className="text-gray-600">
                            {patient.gender} | {calculateAge(patient.date_of_birth)} tuổi
                        </Typography>
                    </div>
                    <div className="mt-4 space-y-3 text-gray-700">
                        <div className="flex items-center space-x-2">
                            <CalendarIcon className="text-cyan-500 h-5 w-5" />
                            <Typography>
                                {patient.total_appointments || 0} cuộc hẹn
                            </Typography>
                        </div>
                    </div>
                </Card>

                {/* Patient Details and Appointment History */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="p-6">
                        <Typography variant="h6" className="font-semibold mb-4">
                            Lịch sử cuộc hẹn
                        </Typography>
                        {appointments.length === 0 ? (
                            <Typography className="text-center text-gray-500">
                                Không có lịch sử cuộc hẹn
                            </Typography>
                        ) : (
                            appointments.map((appointment) => (
                                <div
                                    key={appointment.appointment_id}
                                    className="border-b pb-4 last:border-b-0 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <Typography className="text-gray-700 font-medium">
                                            {new Date(appointment.appointment_date).toLocaleDateString('vi-VN', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </Typography>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                appointment.status === 'CONFIRMED'
                                                    ? 'bg-green-100 text-green-800'
                                                    : appointment.status === 'PENDING'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {appointment.status}
                                        </span>
                                    </div>
                                    <Typography className="text-gray-600">
                                        Dịch vụ: {appointment.service_name || 'Chưa cập nhật'}
                                    </Typography>

                                    {/* Thêm các nút thay đổi trạng thái */}
                                    {appointment.status === 'PENDING' && (
                                        <div className="flex space-x-4 mt-2">
                                            <Button
                                                color="green"
                                                onClick={() => updateAppointmentStatus(appointment.appointment_id, 'CONFIRMED')}
                                            >
                                                Đồng ý
                                            </Button>
                                            <Button
                                                color="red"
                                                onClick={() => updateAppointmentStatus(appointment.appointment_id, 'CANCELLED')}
                                            >
                                                Từ chối
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

// Helper function to calculate age
const calculateAge = (dateOfBirth) => {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }

    return age;
};

export default PatientDetailsPage;
