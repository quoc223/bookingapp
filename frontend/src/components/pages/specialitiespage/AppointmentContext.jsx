import React, { createContext, useContext, useState } from 'react';

const AppointmentContext = createContext();

export const useAppointment = () => {
    const context = useContext(AppointmentContext);
    if (!context) {
        throw new Error('useAppointment must be used within an AppointmentProvider');
    }
    return context;
};

export const AppointmentProvider = ({ children }) => {
    const [appointmentDate, setAppointmentDate] = useState(new Date());
    const [appointmentTime, setAppointmentTime] = useState('');
    const [doctorInfo, setDoctorInfo] = useState(null);

    const updateAppointment = (date, time, doctor) => {
        setAppointmentDate(date);
        setAppointmentTime(time);
        setDoctorInfo(doctor);
    };

    return (
        <AppointmentContext.Provider
            value={{
                appointmentDate,
                appointmentTime,
                doctorInfo,
                updateAppointment,
                setAppointmentDate,
                setAppointmentTime,
                setDoctorInfo
            }}
        >
            {children}
        </AppointmentContext.Provider>
    );
};
