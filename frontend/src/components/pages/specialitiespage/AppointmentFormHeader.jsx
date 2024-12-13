import React from 'react';
import { Clock, MapPin } from 'lucide-react';
import { assets } from '../../../assets/assets';

const AppointmentFormHeader = ({ doctorInfo, appointmentDate, appointmentTime }) => {
    return (
        <div className="p-6 border-b">
            <div className="flex items-start space-x-4">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                    <img
                        src={doctorInfo?.image || assets.DoctorAvatar}
                        alt="Doctor's profile"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-medium">{doctorInfo?.doctor_name}</h3>
                    <div className="flex items-center mt-2 text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{appointmentDate?.toLocaleDateString('vi-VN')}, {appointmentTime}</span>
                    </div>
                    <div className="flex items-center mt-2 text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <div>
                            <div>{doctorInfo?.hospital_name}</div>
                            <div className="text-sm">{doctorInfo?.hospital_address}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentFormHeader;
