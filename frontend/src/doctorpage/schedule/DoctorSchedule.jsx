import React, { useState, useEffect } from 'react';
import { Card, Typography, Input, Select, Option, Button, Dialog, DialogBody, DialogFooter } from "@material-tailwind/react";
import axios from 'axios';
import {
    CalendarIcon,
    ClockIcon,
    TimerIcon,
    AlertCircleIcon,
    CheckCircle2Icon
} from 'lucide-react';

export default function ScheduleManagement() {
    const [workHours, setWorkHours] = useState({
        day_of_week: '',
        start_time: '',
        end_time: '',
        is_available: true
    });

    const [appointmentSlots, setAppointmentSlots] = useState({
        start_datetime: '',
        end_datetime: '',
        slot_duration: ''
    });

    const [dialog, setDialog] = useState({
        open: false,
        title: '',
        message: '',
        isError: false
    });

    const handleDialogClose = () => setDialog({ ...dialog, open: false });

    const handleWorkHoursChange = (e) => {
        const { name, value } = e.target;
        setWorkHours(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAppointmentSlotsChange = (e) => {
        const { name, value } = e.target;
        setAppointmentSlots(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSetWorkHours = async (e) => {
        e.preventDefault();
        try {
            // Gọi API mà không cần dùng token trong header
            await axios.post(
                `${import.meta.env.VITE_DOMAINNAME}api/work-hours`,
                workHours
            );
            setDialog({
                open: true,
                title: 'Thành công',
                message: 'Cập nhật giờ làm việc thành công!',
                isError: false
            });
        } catch (error) {
            console.error('Error setting work hours:', error);
            setDialog({
                open: true,
                title: 'Lỗi',
                message: 'Cập nhật giờ làm việc thất bại. Vui lòng thử lại.',
                isError: true
            });
        }
    };

    const handleRegisterAppointmentSlots = async (e) => {
        e.preventDefault();
        try {
            // Gọi API mà không cần dùng token trong header
            await axios.post(
                `${import.meta.env.VITE_DOMAINNAME}api/doctor/appointment-slots`,
                appointmentSlots
            );
            setDialog({
                open: true,
                title: 'Thành công',
                message: 'Đăng ký lịch hẹn thành công!',
                isError: false
            });
        } catch (error) {
            console.error('Error registering appointment slots:', error);
            setDialog({
                open: true,
                title: 'Lỗi',
                message: 'Đăng ký lịch hẹn thất bại. Vui lòng thử lại.',
                isError: true
            });
        }
    };

    return (
        <div className="min-h-screen bg-blue-50 py-10">
            <div className="container mx-auto space-y-8">
                {/* Work Hours Management Card */}
                <Card className="w-full max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-6">
                        <Typography variant="h4" color="white" className="flex items-center">
                            <CalendarIcon className="mr-3" /> Quản lý giờ làm việc
                        </Typography>
                    </div>
                    <form onSubmit={handleSetWorkHours} className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <Select
                                    name="day_of_week"
                                    label="Ngày trong tuần"
                                    value={workHours.day_of_week}
                                    onChange={(val) => setWorkHours(prev => ({...prev, day_of_week: val}))}
                                    icon={<CalendarIcon className="text-blue-500" />}
                                >
                                    {['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật']
                                        .map(day => <Option key={day} value={day}>{day}</Option>)}
                                </Select>
                            </div>
                            <div>
                                <Input
                                    name="start_time"
                                    type="time"
                                    label="Giờ bắt đầu"
                                    value={workHours.start_time}
                                    onChange={handleWorkHoursChange}
                                    icon={<ClockIcon className="text-blue-500" />}
                                />
                            </div>
                            <div>
                                <Input
                                    name="end_time"
                                    type="time"
                                    label="Giờ kết thúc"
                                    value={workHours.end_time}
                                    onChange={handleWorkHoursChange}
                                    icon={<ClockIcon className="text-blue-500" />}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                color="blue"
                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 transition-all duration-300"
                            >
                                Cập nhật giờ làm việc
                            </Button>
                        </div>
                    </form>
                </Card>

                {/* Appointment Slots Registration Card */}
                <Card className="w-full max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-green-600 to-green-400 p-6">
                        <Typography variant="h4" color="white" className="flex items-center">
                            <TimerIcon className="mr-3" /> Đăng ký lịch hẹn
                        </Typography>
                    </div>
                    <form onSubmit={handleRegisterAppointmentSlots} className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <Input
                                    name="start_datetime"
                                    type="datetime-local"
                                    label="Ngày và giờ bắt đầu"
                                    value={appointmentSlots.start_datetime}
                                    onChange={handleAppointmentSlotsChange}
                                    icon={<CalendarIcon className="text-green-500" />}
                                />
                            </div>
                            <div>
                                <Input
                                    name="end_datetime"
                                    type="datetime-local"
                                    label="Ngày và giờ kết thúc"
                                    value={appointmentSlots.end_datetime}
                                    onChange={handleAppointmentSlotsChange}
                                    icon={<CalendarIcon className="text-green-500" />}
                                />
                            </div>
                            <div>
                                <Input
                                    name="slot_duration"
                                    type="number"
                                    label="Thời gian mỗi lượt (phút)"
                                    value={appointmentSlots.slot_duration}
                                    onChange={handleAppointmentSlotsChange}
                                    icon={<TimerIcon className="text-green-500" />}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                color="green"
                                className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-400 hover:from-green-700 hover:to-green-500 transition-all duration-300"
                            >
                                Đăng ký lịch hẹn
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>

            {/* Feedback Dialog */}
            <Dialog
                open={dialog.open}
                handler={handleDialogClose}
                className={dialog.isError ? "bg-red-50" : "bg-green-50"}
            >
                <DialogBody>
                    <div className="flex items-center space-x-4">
                        {dialog.isError ? (
                            <AlertCircleIcon className="text-red-500 w-12 h-12" />
                        ) : (
                            <CheckCircle2Icon className="text-green-500 w-12 h-12" />
                        )}
                        <div>
                            <Typography
                                variant="h5"
                                color={dialog.isError ? "red" : "green"}
                                className="mb-2"
                            >
                                {dialog.title}
                            </Typography>
                            <Typography>{dialog.message}</Typography>
                        </div>
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button
                        color={dialog.isError ? "red" : "green"}
                        onClick={handleDialogClose}
                    >
                        Đóng
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
}
