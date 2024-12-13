import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppointmentProvider } from './components/pages/specialitiespage/AppointmentContext';

// Import Protected Routes
import ProtectedRouteDoctor from './middleware/ProtectDoctor.jsx';
import ProtectedRouteAdmin from './middleware/ProtectAdmin.jsx';
import ProtectedRoutePatient from './middleware/protect.jsx';

// Import Page Components
import Layout from './components/pages/layout';
import HomePage from './components/pages/homepage.jsx';
import AppointmentBookingForm from './components/pages/specialitiespage/detailappointment.jsx';
import DoctorProfile from './components/pages/specialitiespage/doctordetail.jsx';
import DoctorListing from './components/pages/specialitiespage/DoctorListing.jsx';
import ContactForm from './doctorpage/contact.jsx';
import NotFoundPage from './components/pages/404.jsx';

import Login from './components/pages/login.jsx';
import Register from './components/pages/register.jsx';
import MainLayout from './doctorpage/MainLayout.jsx';
import AdminLayout from './admin/AdminLayout.jsx';
import DoctorAppointments from './doctorpage/appointment/ManagerAppointment.jsx';
import UnauthorizedPage from './middleware/UnauthorizedPage';
import DoctorLogin from "./doctorpage/DoctorLogin.jsx";
import PatientManagement from "./doctorpage/appointment/PatientManagement.jsx";
import PatientManagements from "./admin/PatientManagement.jsx";
import PatientDetailsPage from "./doctorpage/appointment/PatientDetailsPage.jsx";
import DoctorDashboard from "./doctorpage/DoctorDashboard.jsx";
import ScheduleManagement from "./doctorpage/schedule/DoctorSchedule.jsx";
import BlogManagement from "./doctorpage/blog/Managerblogs.jsx";
import Reporting from "./doctorpage/report/DoctorReport.jsx";
import {ProfileManagement} from "./doctorpage/profile/DoctorProfileManagment.jsx";
import AppointmentPaymentForm from "./components/pages/specialitiespage/AppointmentFormPayment.jsx";
import LoginDashboard from "./admin/authentication/login.jsx";
import Dashboard from "./admin/Dashboard.jsx";
import DoctorAccountManagement from "./admin/DoctorAccountManagement.jsx";
import {DoctorAccounts} from "./admin/DoctorAccount.jsx";
// import {PatientAccounts} from "./admin/PatientAccounts.jsx";
function App() {
    return (
        <AppointmentProvider>
            <Router>
                <Routes>
                    {/* Public Layout */}
                    <Route path="/" element={<Layout />}>
                        <Route index element={<HomePage />} />
                        <Route path="listdoctor/:specialtyId" element={<DoctorListing />} />
                        <Route path="contact" element={<ContactForm />} />
                        <Route path="login" element={<Login />} />
                        <Route path="doctor/login" element={<DoctorLogin />} />
                        <Route path="register" element={<Register />} />

                    </Route>
                    <Route path="logindashboard" element={<LoginDashboard />} />
                    // Doctor Protected Routes
                    <Route element={<ProtectedRouteDoctor />}>
                        <Route path="/doctor" element={<MainLayout />}>
                            <Route path="dashboard" element={<DoctorDashboard />} />
                            <Route path="appointments" element={<DoctorAppointments />} />
                            <Route path="patients" element={<PatientManagement />} />
                            <Route path="patients/:patientId" element={<PatientDetailsPage />} />

                            {/* Profile Management Route */}
                            <Route path="profile-management" element={<ProfileManagement />} />

                            {/* Schedule Management Route */}
                            <Route path="schedule-management" element={<ScheduleManagement />} />

                            {/* Blog Management Route */}
                            <Route path="blog-management" element={<BlogManagement />} />

                            {/* Reporting Route */}
                            <Route path="reporting" element={<Reporting />} />

                            {/* Optional Routes - Uncomment when implemented */}
                            {/*<Route path="messages" element={<MessagesPage />} />*/}
                            {/*<Route path="settings" element={<SettingsPage />} />*/}
                        </Route>
                    </Route>

                    {/* Admin Protected Routes */}
                    <Route element={<ProtectedRouteAdmin />}>
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="users/patients" element={<PatientManagements />} />
                            <Route path="users/doctors" element={<DoctorAccountManagement />} />
                            <Route path="users/roles" element={<DoctorAccounts />} />
                            {/* Add other admin-related routes here */}
                        </Route>
                    </Route>

                    {/* Patient Protected Routes */}
                    <Route element={<ProtectedRoutePatient />}>
                        <Route path="/" element={<Layout />}>
                            <Route path="appointment" element={<AppointmentBookingForm />} />
                            <Route path="doctorprofile/:dortorid" element={<DoctorProfile />} />
                            <Route path="appointment/:appointmentId/payment" element={<AppointmentPaymentForm />} />


                        </Route>
                    </Route>

                    {/* Additional Routes */}
                    <Route path="unauthorized" element={<UnauthorizedPage />} />

                    {/* Catch-all route */}
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Router>
        </AppointmentProvider>
    );
}

export default App;
