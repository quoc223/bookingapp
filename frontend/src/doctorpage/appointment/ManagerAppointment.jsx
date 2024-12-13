import React, { useState, useEffect } from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button,
    Input,
    Chip,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Avatar
} from "@material-tailwind/react";
import {
    MagnifyingGlassIcon,
    TrashIcon,
    CheckIcon,
    XMarkIcon
} from "@heroicons/react/24/solid";

export default function DoctorAppointments() {
    const [appointments, setAppointments] = useState([
        {
            id: 1,
            patient: {
                name: "John Doe",
                avatar: "https://placehold.co/40x40",
                service: "Health Checkup"
            },
            date: "2024-02-15T14:30:00",
            status: "PENDING"
        },
        {
            id: 2,
            patient: {
                name: "Jane Smith",
                avatar: "https://placehold.co/40x40",
                service: "Consultation"
            },
            date: "2024-02-15T16:45:00",
            status: "PENDING"
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    useEffect(() => {
        // Check and remove appointments older than 2 hours if not accepted
        const currentTime = new Date();
        const filteredAppointments = appointments.filter(appointment => {
            const appointmentTime = new Date(appointment.date);
            const timeDiff = (currentTime - appointmentTime) / (1000 * 60 * 60); // hours
            return !(timeDiff > 2 && appointment.status === "PENDING");
        });

        if (filteredAppointments.length !== appointments.length) {
            setAppointments(filteredAppointments);
        }
    }, []);

    const handleAcceptAppointment = (id) => {
        setAppointments(appointments.map(app =>
            app.id === id
                ? { ...app, status: "CONFIRMED" }
                : app
        ));
    };

    const handleDeleteAppointment = () => {
        if (selectedAppointment) {
            setAppointments(appointments.filter(app => app.id !== selectedAppointment.id));
            setIsDeleteDialogOpen(false);
            setSelectedAppointment(null);
        }
    };

    const filteredAppointments = appointments.filter(appointment =>
        appointment.patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const pendingAppointments = filteredAppointments.filter(app => app.status === "PENDING");
    const confirmedAppointments = filteredAppointments.filter(app => app.status === "CONFIRMED");

    return (
        <Card className="w-full max-w-[24rem]">
            <CardHeader
                color="blue"
                className="mb-4 p-4 flex justify-between items-center"
            >
                <Typography variant="h5" color="white">
                    Appointments
                </Typography>
                <div className="w-full max-w-[12rem] ml-4">
                    <Input
                        label="Search Patients"
                        icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </CardHeader>
            <CardBody>
                <Typography variant="h6" color="blue-gray" className="mb-4">
                    Pending Appointments
                </Typography>
                {pendingAppointments.length === 0 ? (
                    <Typography variant="small" color="gray">
                        No pending appointments
                    </Typography>
                ) : (
                    pendingAppointments.map((appointment) => (
                        <div
                            key={appointment.id}
                            className="flex justify-between items-center border-b py-2"
                        >
                            <div className="flex items-center space-x-4">
                                <Avatar
                                    src={appointment.patient.avatar}
                                    alt={appointment.patient.name}
                                />
                                <div>
                                    <Typography variant="h6">
                                        {appointment.patient.name}
                                    </Typography>
                                    <Typography variant="small" color="gray">
                                        {appointment.patient.service}
                                    </Typography>
                                    <Typography variant="small" color="gray">
                                        {new Date(appointment.date).toLocaleString()}
                                    </Typography>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <Button
                                    size="sm"
                                    color="green"
                                    variant="outlined"
                                    onClick={() => handleAcceptAppointment(appointment.id)}
                                >
                                    <CheckIcon className="h-4 w-4 mr-1" />
                                    Accept
                                </Button>
                                <Button
                                    size="sm"
                                    color="red"
                                    variant="outlined"
                                    onClick={() => {
                                        setSelectedAppointment(appointment);
                                        setIsDeleteDialogOpen(true);
                                    }}
                                >
                                    <TrashIcon className="h-4 w-4 mr-1" />
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))
                )}

                <Typography variant="h6" color="blue-gray" className="mt-6 mb-4">
                    Confirmed Appointments
                </Typography>
                {confirmedAppointments.length === 0 ? (
                    <Typography variant="small" color="gray">
                        No confirmed appointments
                    </Typography>
                ) : (
                    confirmedAppointments.map((appointment) => (
                        <div
                            key={appointment.id}
                            className="flex justify-between items-center border-b py-2"
                        >
                            <div className="flex items-center space-x-4">
                                <Avatar
                                    src={appointment.patient.avatar}
                                    alt={appointment.patient.name}
                                />
                                <div>
                                    <Typography variant="h6">
                                        {appointment.patient.name}
                                    </Typography>
                                    <Typography variant="small" color="gray">
                                        {appointment.patient.service}
                                    </Typography>
                                    <Typography variant="small" color="gray">
                                        {new Date(appointment.date).toLocaleString()}
                                    </Typography>
                                </div>
                            </div>
                            <Chip
                                value="Confirmed"
                                color="green"
                                size="sm"
                            />
                        </div>
                    ))
                )}
            </CardBody>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={isDeleteDialogOpen}
                handler={() => setIsDeleteDialogOpen(!isDeleteDialogOpen)}
            >
                <DialogHeader>
                    <Typography variant="h5" color="blue-gray">
                        Delete Appointment
                    </Typography>
                </DialogHeader>
                <DialogBody>
                    <Typography>
                        Are you sure you want to delete the appointment for
                        {" "}{selectedAppointment?.patient.name}?
                    </Typography>
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={() => setIsDeleteDialogOpen(false)}
                        className="mr-1"
                    >
                        <span>Cancel</span>
                    </Button>
                    <Button
                        variant="gradient"
                        color="green"
                        onClick={handleDeleteAppointment}
                    >
                        <span>Confirm</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </Card>
    );
}
