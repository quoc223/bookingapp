import React, { useEffect, useState } from 'react';
import { useAppointment } from './AppointmentContext';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AppointmentFormHeader from './AppointmentFormHeader';
import AppointmentFormInputs from './AppointmentFormInputs';

const ERROR_MESSAGES = {
    required: 'Vui lòng điền đầy đủ thông tin',
    invalidEmail: 'Email không hợp lệ',
    invalidPhone: 'Số điện thoại không hợp lệ (phải có 10 số và bắt đầu bằng số 0)',
    pastAppointment: 'Ngày hẹn không thể là ngày trong quá khứ',
    invalidDate: 'Ngày không hợp lệ',
    serverError: 'Có lỗi xảy ra, vui lòng thử lại sau',
    appointmentCreated: 'Đặt lịch khám thành công',
    requiredFields: {
        name: 'Họ và tên',
        date_of_birth: 'Ngày sinh',
        gender: 'Giới tính',
        address: 'Địa chỉ',
        email: 'Email',
        phone: 'Số điện thoại',
        doctor_id: 'Mã bác sĩ',
        appointment_date: 'Ngày hẹn',
        notes: 'Ghi chú'
    }
};

const AppointmentBookingForm = () => {
    const {appointmentDate, appointmentTime, doctorInfo} = useAppointment();
    const navigate = useNavigate();

    // Geography state
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [detailedAddress, setDetailedAddress] = useState('');



    const apiUrl = import.meta.env.VITE_DOMAINNAME;

    const [formData, setFormData] = useState({
        name: '',
        dateOfBirth: '',
        gender: 'Male',
        address: '',
        email: '',
        phone: '',
        emergencyContact: '',
        emergencyPhone: '',
        medicalHistory: '',
        doctor_id: doctorInfo?.doctor_id,
        appointment_date: '',
        notes: '',
    });

    // Geography handlers
    const handleProvinceChange = (e) => {
        const newProvinceCode = e.target.value;
        setSelectedProvince(newProvinceCode);
        setSelectedDistrict('');
        setSelectedWard('');
        // Reset dependent fields
        setDistricts([]);
        setWards([]);
    };

    const handleDistrictChange = (e) => {
        const newDistrictCode = e.target.value;
        setSelectedDistrict(newDistrictCode);
        setSelectedWard('');
        // Reset dependent fields
        setWards([]);
    };

    const handleWardChange = (e) => {
        const newWardCode = e.target.value;
        setSelectedWard(newWardCode);
    };

    const getFullAddress = () => {
        const parts = [];
        if (detailedAddress) parts.push(detailedAddress);
        if (selectedWard) {
            const ward = wards.find(w => w.code.toString() === selectedWard);
            if (ward) parts.push(ward.name);
        }
        if (selectedDistrict) {
            const district = districts.find(d => d.code.toString() === selectedDistrict);
            if (district) parts.push(district.name);
        }
        if (selectedProvince) {
            const province = provinces.find(p => p.code.toString() === selectedProvince);
            if (province) parts.push(province.name);
        }
        return parts.join(', ');
    };

// Provinces fetch
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await axios.get(`${__DOMAINNAME__}api/provinces`);
                console.log('Fetched Provinces:', response.data);  // Log the response
                setProvinces(response.data);
            } catch (error) {
                toast.error('Failed to load provinces');
            }
        };
        fetchProvinces();
    }, []);


// Districts fetch based on selected province
    useEffect(() => {
        const fetchDistricts = async () => {
            if (!selectedProvince) {
                setDistricts([]);
                return;
            }
            try {
                const response = await axios.get(`${__DOMAINNAME__}api/districts`);

                // Normalize data to an array and filter based on selectedProvince
                const fetchedDistricts = Array.isArray(response.data) ? response.data : [response.data];

                const filteredDistricts = fetchedDistricts.filter(district => district.province_code.toString() === selectedProvince);

                console.log('Filtered Districts:', filteredDistricts);
                setDistricts(filteredDistricts);

                // Reset dependent selections
                setSelectedDistrict('');
                setSelectedWard('');
            } catch (error) {
                console.error('Error fetching districts:', error);
                toast.error('Failed to load districts');
                setDistricts([]);
            }
        };

        fetchDistricts();
    }, [selectedProvince]);


// Similar approach for wards
    useEffect(() => {
        const fetchWards = async () => {
            if (!selectedDistrict) {
                setWards([]);
                return;
            }
            try {
                const response = await axios.get(`${__DOMAINNAME__}api/wards/${selectedDistrict}`);
                console.log('Fetched Wards:', response.data);  // Log data here
                const fetchedWards = Array.isArray(response.data) ? response.data : [response.data];
                setWards(fetchedWards);
                setSelectedWard('');
            } catch (error) {
                console.error('Error fetching wards:', error);
                toast.error('Failed to load wards');
                setWards([]);
            }
        };

        fetchWards();
    }, [selectedDistrict]);




    // Update appointment date when it changes
    useEffect(() => {
        if (appointmentDate && appointmentTime) {
            try {
                const [hours, minutes] = appointmentTime.split(':');

                // Tạo date object với giờ local
                const formattedDate = new Date(
                    appointmentDate.getFullYear(),
                    appointmentDate.getMonth(),
                    appointmentDate.getDate(),
                    parseInt(hours),
                    parseInt(minutes)
                );

                // Format date không sử dụng toISOString()
                const formattedDateString = formattedDate.getFullYear() + '-' +
                    String(formattedDate.getMonth() + 1).padStart(2, '0') + '-' +
                    String(formattedDate.getDate()).padStart(2, '0') + ' ' +
                    String(formattedDate.getHours()).padStart(2, '0') + ':' +
                    String(formattedDate.getMinutes()).padStart(2, '0') + ':00';

                setFormData(prev => ({
                    ...prev,
                    appointment_date: formattedDateString
                }));
            } catch (error) {
                console.error('Invalid date or time:', error);
                toast.error('Ngày hoặc giờ không hợp lệ');
            }
        }
    }, [appointmentDate, appointmentTime]);

    // Update address when address components change
    useEffect(() => {
        const fullAddress = getFullAddress();
        setFormData(prev => ({
            ...prev,
            address: fullAddress
        }));
    }, [selectedProvince, selectedDistrict, selectedWard, detailedAddress]);

    const validateField = (name, value) => {
        switch (name) {
            case 'name':
                return value.length >= 2 && value.length <= 100
                    ? ''
                    : 'Tên phải từ 2-100 ký tự';

            case 'dateOfBirth':
                const dobDate = new Date(value);
                const nowDate = new Date();
                return (dobDate && dobDate < nowDate)
                    ? ''
                    : 'Ngày sinh không hợp lệ';

            case 'email':
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                    ? ''
                    : 'Email không hợp lệ';

            case 'phone':
                return /^(0[2-9])(\d{8,9})$/.test(value)
                    ? ''
                    : 'Số điện thoại không hợp lệ (10-11 số, bắt đầu 02-09)';

            case 'emergencyPhone':
                return /^(0[2-9])(\d{8,9})$/.test(value)
                    ? ''
                    : 'Số điện thoại khẩn cấp không hợp lệ';

            case 'gender':
                return ['Male', 'Female'].includes(value)
                    ? ''
                    : 'Giới tính không hợp lệ';

            case 'appointment_date':
                const parseCustomDate = (dateString) => {
                    // Xử lý định dạng từ MySQL: 'YYYY-MM-DD HH:mm:ss'
                    if (dateString.includes(' ')) {
                        const [datePart] = dateString.split(' ');
                        const [year, month, day] = datePart.split('-').map(Number);
                        return new Date(year, month - 1, day);
                    }

                    // Giữ nguyên logic cũ cho các định dạng khác
                    const [day, month, year] = dateString.split('/').map(Number);
                    return new Date(year, month - 1, day);
                };

                const appointmentDateVal = parseCustomDate(value);
                const currentDate = new Date();

                // Reset hours, minutes, seconds, and milliseconds for accurate comparison
                currentDate.setHours(0, 0, 0, 0);
                appointmentDateVal.setHours(0, 0, 0, 0);

                return (appointmentDateVal >= currentDate)
                    ? ''
                    : 'Ngày hẹn không hợp lệ';

            case 'appointment_time':
                // Basic time validation
                return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value)
                    ? ''
                    : 'Thời gian không hợp lệ';

            default:
                return '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Debug logging
        console.log('Form Submit Triggered');
        // Comprehensive validation
        const validationErrors = [];

        // Log từng bước validation
        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) {
                validationErrors.push(error);
            }
        });

        console.log('Validation Errors:', validationErrors);

        // Additional specific validations
        if (formData.phone === formData.emergencyPhone) {
            const phoneError = 'Số điện thoại khẩn cấp phải khác số điện thoại chính';
            validationErrors.push(phoneError);
        }

        // Display errors or proceed with submission
        if (validationErrors.length > 0) {
            console.log('Validation Failed, Stopping Submission');
            validationErrors.forEach(error => toast.error(error));
            return;
        }
        console.log('Validation Passed, Continuing Submission');

        // Date formatting utility
        const formatDateTimeForDB = (inputDate, inputTime) => {
            let day, month, year;

            // Check if date is in YYYY-MM-DD format
            if (inputDate.includes('-')) {
                [year, month, day] = inputDate.split('-');
            }
            // Assume DD/MM/YYYY format
            else {
                [day, month, year] = inputDate.split('/');
            }

            const [hours, minutes] = inputTime.split(':');

            const formattedDate = new Date(
                parseInt(year),
                parseInt(month) - 1,
                parseInt(day),
                parseInt(hours),
                parseInt(minutes)
            );

            return formattedDate.getFullYear() + '-' +
                String(formattedDate.getMonth() + 1).padStart(2, '0') + '-' +
                String(formattedDate.getDate()).padStart(2, '0') + ' ' +
                String(formattedDate.getHours()).padStart(2, '0') + ':' +
                String(formattedDate.getMinutes()).padStart(2, '0') + ':00';
        };
        // Prepare API data
        const appointmentData = {
            name: formData.name?.trim(),
            date_of_birth: formData.dateOfBirth,
            gender: formData.gender || 'Male',
            address: formData.address?.trim(),
            email: formData.email?.trim(),
            phone: formData.phone?.trim(),
            emergency_contact: formData.emergencyContact?.trim() || null,
            emergency_phone: formData.emergencyPhone?.trim() || null,
            medical_history: formData.medicalHistory?.trim() || null,
            doctor_id: parseInt(doctorInfo.doctor_id, 10),
            // Use the date formatting function
            appointment_date: formatDateTimeForDB(
                appointmentDate.toLocaleDateString('en-GB'), // Convert to DD/MM/YYYY
                appointmentTime
            ),
            notes: formData.notes?.trim() || ''
        };





        try {
            const response = await axios.post(
                `${apiUrl}api/appointment`,
                appointmentData,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    timeout: 10000
                }
            );

            // Debug: Log full API response

            // Check response success
            if (response.data.success) {
                toast.success('Đặt lịch khám thành công');
                const appointmentId = response.data.appointmentId;
                navigate(`/appointment/${appointmentId}/payment`);
            } else {
                // Log if success is false
                console.error('API returned success: false', response.data);
                toast.error('Có lỗi xảy ra khi đặt lịch');
            }
        } catch (error) {
            // Comprehensive error logging
            console.error('API Call Error:', error);

            // Log specific error details
            if (error.response) {
                console.error('Error Response Data:', error.response.data);
                console.error('Error Response Status:', error.response.status);
                console.error('Error Response Headers:', error.response.headers);
            } else if (error.request) {
                console.error('Error Request:', error.request);
            } else {
                console.error('Error Message:', error.message);
            }

            // Toast error message
            toast.error('Không thể đặt lịch. Vui lòng thử lại.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Show validation error immediately
        const error = validateField(name, value);
        if (error) {
            toast.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg" action="#" method="POST">
            <AppointmentFormHeader
                doctorInfo={doctorInfo}
                appointmentDate={appointmentDate}
                appointmentTime={appointmentTime}
            />
            <div className="p-6">
                <AppointmentFormInputs
                    formData={formData}
                    handleInputChange={handleInputChange}
                    provinces={provinces}
                    districts={districts}
                    wards={wards}
                    selectedProvince={selectedProvince}
                    selectedDistrict={selectedDistrict}
                    selectedWard={selectedWard}
                    detailedAddress={detailedAddress}
                    handleProvinceChange={handleProvinceChange}
                    handleDistrictChange={handleDistrictChange}
                    handleWardChange={handleWardChange}
                    setDetailedAddress={setDetailedAddress}
                    getFullAddress={getFullAddress}
                />

                <div className="mt-6">
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                        onClick={handleSubmit}
                    >
                        Đặt lịch khám
                    </button>
                </div>
            </div>
        </form>
    );
};

export default AppointmentBookingForm;
