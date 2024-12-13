import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Phone } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAppointment } from './AppointmentContext';
import { assets } from '../../../assets/assets.js';

const MAX_APPOINTMENTS_PER_SLOT = 2;

const DoctorProfile = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [appointmentCounts, setAppointmentCounts] = useState({});
    const [availableTimeSlots] = useState([
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
    ]);
    const navigate = useNavigate();
    const { dortorid } = useParams();
    const [doctorDetail, setDoctorDetail] = useState(null);
    const {
        appointmentDate,
        appointmentTime,
        setAppointmentDate,
        setAppointmentTime,
        setDoctorInfo
    } = useAppointment();

    const apiURL = import.meta.env.VITE_DOMAINNAME;

    // Fetch doctor details and services
    useEffect(() => {
            const fetchDoctorDetails = async () => {
            try {
                const response = await axios.get(`${__DOMAINNAME__}api/getdoctorprofile/${dortorid}`);
                if (response.data && Array.isArray(response.data)) {
                    const doctor = response.data[0];
                    setDoctorDetail(doctor);
                    setDoctorInfo(doctor);
                }
            } catch (error) {
                console.error('Error fetching doctor details:', error);
            }
        };
        fetchDoctorDetails();
    }, [dortorid, setDoctorInfo, apiURL]);

    // Fetch appointment counts
    useEffect(() => {
        const fetchAppointmentCounts = async () => {
            if (!appointmentDate) return;

            try {
                const formattedDate = appointmentDate.toISOString().split('T')[0];
                const response = await axios.get(`${apiURL}api/getappointmentcounts`, {
                    params: {
                        doctor_id: dortorid,
                        appointment_date: formattedDate
                    }
                });
                setAppointmentCounts(response.data);
            } catch (error) {
                console.error('Error fetching appointment counts:', error);
                setAppointmentCounts({});
            }
        };
        fetchAppointmentCounts();
    }, [appointmentDate, dortorid, apiURL]);

    const handleBookAppointment = () => {
        if (!appointmentTime) {
            alert('Vui lòng chọn thời gian khám');
            return;
        }

        // Check if the time slot is still available
        if ((appointmentCounts[appointmentTime] || 0) >= MAX_APPOINTMENTS_PER_SLOT) {
            alert('Khung giờ này đã đầy. Vui lòng chọn giờ khác.');
            setAppointmentTime(null);
            return;
        }

        navigate(`/appointment`);
    };

    const handleTimeSelect = (time) => {
        if ((appointmentCounts[time] || 0) < MAX_APPOINTMENTS_PER_SLOT) {
            setAppointmentTime(time);
        }
    };

    const isTimeSlotFull = (time) => {
        return (appointmentCounts[time] || 0) >= MAX_APPOINTMENTS_PER_SLOT;
    };

    if (!doctorDetail) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
            <div className="p-6 border-b flex items-center">
                <img
                    src={doctorDetail.image || assets.DoctorAvatar}
                    alt="Doctor's Profile"
                    className="w-20 h-20 rounded-full"
                />
                <div className="ml-4">
                    <h3 className="text-xl font-medium">{doctorDetail.doctor_name}</h3>
                    <p className="text-gray-500 text-sm">{doctorDetail.specialty_name}</p>
                </div>
            </div>
            <div className="p-6 space-y-4">
                <div className="space-y-4">
                    {/* Date Picker */}
                    <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="w-5 h-5" />
                        <DatePicker
                            selected={appointmentDate}
                            onChange={(date) => {
                                setAppointmentDate(date);
                                setAppointmentTime(null); // Reset time when date changes
                            }}
                            showMonthYearDropdown
                            minDate={new Date()}
                            className="bg-white border border-gray-300 rounded-md px-2 py-1"
                        />
                    </div>

                    {/* Time Slots */}
                    <div className="mt-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <Clock className="w-5 h-5" />
                            <span className="text-gray-600">Chọn thời gian khám:</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {availableTimeSlots.map((time) => (
                                <button
                                    key={time}
                                    onClick={() => handleTimeSelect(time)}
                                    disabled={isTimeSlotFull(time)}
                                    className={`px-4 py-2 rounded-md text-sm ${
                                        isTimeSlotFull(time)
                                            ? 'bg-red-50 text-red-500 cursor-not-allowed'
                                            : appointmentTime === time
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    <div>{time}</div>
                                    <div className="text-xs mt-1">
                                        {isTimeSlotFull(time)
                                            ? 'Đã đầy'
                                            : `${appointmentCounts[time] || 0}/${MAX_APPOINTMENTS_PER_SLOT} slot`}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Appointment Details */}
                    {appointmentTime && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-md">
                            <h4 className="font-medium text-blue-800">Thông tin đặt khám:</h4>
                            <p className="text-blue-600">
                                Ngày: {appointmentDate.toLocaleDateString('vi-VN')}
                                <br />
                                Thời gian: {appointmentTime}
                            </p>
                        </div>
                    )}

                    {/* Book Button */}
                    <button
                        onClick={handleBookAppointment}
                        className={`w-full px-4 py-2 rounded-md ${
                            appointmentTime
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={!appointmentTime}
                    >
                        Đặt lịch khám
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DoctorProfile;
