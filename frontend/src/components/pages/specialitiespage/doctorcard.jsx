import { useState, useEffect } from 'react';
import { MapPin, Calendar, Heart, Clock, Phone } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { useAppointment } from "./AppointmentContext.jsx";


const MAX_APPOINTMENTS_PER_SLOT = 2;

const DoctorCard = ({ doctor }) => {
    const navigate = useNavigate();
    const { setAppointmentDate, setAppointmentTime, setDoctorInfo } = useAppointment();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(null);
    const [isTimeSlotVisible, setIsTimeSlotVisible] = useState(false);
    const [appointmentCounts, setAppointmentCounts] = useState({});
    const apiURL = import.meta.env.VITE_DOMAINNAME;

    const availableTimeSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
    ];

    useEffect(() => {
        const fetchAppointmentCounts = async () => {
            if (!isTimeSlotVisible) return; // Only fetch if time slots are visible

            try {
                const year = selectedDate.getFullYear();
                const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                const day = String(selectedDate.getDate()).padStart(2, '0');
                const formattedDate = `${year}-${month}-${day}`;

                const response = await axios.get(`${apiURL}api/getappointmentcounts`, {
                    params: {
                        doctor_id: doctor.doctor_id,
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
    }, [selectedDate, doctor.doctor_id, isTimeSlotVisible, apiURL]);

    const isTimeSlotFull = (time) => {
        return (appointmentCounts[time] || 0) >= MAX_APPOINTMENTS_PER_SLOT;
    };

    const handleTimeSelect = (time) => {
        if (!isTimeSlotFull(time)) {
            setSelectedTime(time);
        }
    };

    const handleBookAppointment = () => {
        if (!selectedTime) {
            alert('Vui lòng chọn thời gian khám');
            return;
        }

        // Check again if slot is still available
        if (isTimeSlotFull(selectedTime)) {
            alert('Rất tiếc, khung giờ này đã đầy. Vui lòng chọn khung giờ khác.');
            setSelectedTime(null);
            return;
        }

        setAppointmentDate(selectedDate);
        setAppointmentTime(selectedTime);
        setDoctorInfo(doctor);
        navigate('/appointment');
    };

    const toggleTimeSlots = () => {
        setIsTimeSlotVisible(!isTimeSlotVisible);
    };

    const handleClickProfile = (doctorID) => {
        navigate(`/doctorprofile/${doctorID}`);
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
            <div className="flex gap-6">
                {/* Doctor Info Section */}
                <div className="flex-shrink-0">
                    <div className="relative">
                        <img
                            src={doctor.image}
                            alt={`Ảnh bác sĩ ${doctor.name}`}
                            className="w-32 h-32 rounded-lg object-cover"
                        />
                        <button
                            onClick={() => handleClickProfile(doctor.doctor_id)}
                            className="absolute bottom-1 left-0 w-full text-sm text-blue-500 hover:text-blue-600 bg-white bg-opacity-75 py-1"
                        >
                            Xem thêm
                        </button>
                    </div>
                </div>

                {/* Doctor Details Section */}
                <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="bg-yellow-400 text-white px-2 py-1 rounded-md text-sm flex items-center">
                            <Heart className="w-4 h-4 mr-1" />
                            Yêu thích
                        </span>
                        <h3 className="text-lg font-semibold text-blue-600">{doctor.name}</h3>
                    </div>

                    <p className="text-gray-600 text-sm mb-2">
                        <span className="font-medium">Kinh nghiệm:</span> {doctor.years_of_experience} năm
                    </p>
                    <p className="text-gray-600 text-sm mb-2">{doctor.bio}</p>

                    <div className="flex items-center text-gray-600 text-sm mb-2">
                        <Phone className="w-4 h-4 mr-2" />
                        <span>{doctor.phone}</span>
                    </div>
                </div>

                {/* Appointment Section */}
                <div className="flex-shrink-0 min-w-[320px]">
                    <div className="mb-4">
                        <div
                            className="flex items-center justify-between mb-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
                            onClick={toggleTimeSlots}
                        >
                            <div className="flex items-center text-gray-700 font-medium">
                                <Calendar className="w-5 h-5 mr-2" />
                                LỊCH KHÁM
                            </div>
                            <span className="text-blue-600 text-sm">
                                {isTimeSlotVisible ? 'Thu gọn' : 'Mở rộng'}
                            </span>
                        </div>

                        {isTimeSlotVisible && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                {/* Date Picker */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Chọn ngày khám:
                                    </label>
                                    <DatePicker
                                        selected={selectedDate}
                                        onChange={(date) => {
                                            setSelectedDate(date);
                                            setSelectedTime(null);
                                        }}
                                        dateFormat="dd/MM/yyyy"
                                        minDate={new Date()}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholderText="Chọn ngày"
                                        showMonthYearDropdown
                                    />
                                </div>

                                {/* Time Slots */}
                                <div className="mb-4">
                                    <div className="flex items-center mb-2">
                                        <Clock className="w-5 h-5 mr-2" />
                                        <span className="text-gray-700 font-medium">Chọn giờ khám:</span>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2">
                                        {availableTimeSlots.map((time) => {
                                            const count = appointmentCounts[time] || 0;
                                            const isFull = isTimeSlotFull(time);

                                            return (
                                                <button
                                                    key={time}
                                                    onClick={() => handleTimeSelect(time)}
                                                    disabled={isFull}
                                                    className={`
                                                        p-2 rounded-md text-sm transition-colors
                                                        ${isFull
                                                        ? 'bg-red-50 text-red-500 cursor-not-allowed'
                                                        : selectedTime === time
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-white text-gray-600 hover:bg-gray-100'
                                                    }
                                                        border border-gray-200
                                                    `}
                                                >
                                                    <div>{time}</div>
                                                    <div className="text-xs mt-1">
                                                        {isFull
                                                            ? 'Đã đầy'
                                                            : `${count}/${MAX_APPOINTMENTS_PER_SLOT} slot`
                                                        }
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Selected Time Display */}
                                {selectedTime && (
                                    <div className="mb-4 p-3 bg-blue-50 rounded-md">
                                        <h4 className="font-medium text-blue-800 mb-2">
                                            Thông tin đặt khám:
                                        </h4>
                                        <p className="text-blue-600 text-sm">
                                            <span className="block">
                                                <strong>Ngày:</strong> {formatDate(selectedDate)}
                                            </span>
                                            <span className="block mt-1">
                                                <strong>Giờ:</strong> {selectedTime}
                                            </span>
                                        </p>
                                    </div>
                                )}

                                {/* Book Button */}
                                <button
                                    onClick={handleBookAppointment}
                                    className={`
                                        w-full px-4 py-2 rounded-md transition-colors
                                        ${selectedTime
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }
                                    `}
                                    disabled={!selectedTime}
                                >
                                    Đặt lịch khám
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Clinic Info */}
                    <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center text-gray-700 font-medium mb-2">
                            <MapPin className="w-5 h-5 mr-2" />
                            <h4>ĐỊA CHỈ KHÁM</h4>
                        </div>
                        <p className="text-sm font-medium mb-1">{doctor.hospital_name}</p>
                        <p className="text-sm text-gray-600">{doctor.hospital_address}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorCard
