import React, { useState, useEffect } from 'react';
import {
    Users,
    FileText,
    Calendar,
    Search,
    Filter,
    Eye,
    BookOpen
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PatientManagement = () => {
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await axios.get(`${__DOMAINNAME__}api/getdoctorpatients`, {
                withCredentials: true
            });

            const data = response.data.data.map(patient => ({
                ...patient,
                latest_appointment_date: patient.latest_appointment_date
                    ? new Date(patient.latest_appointment_date).toLocaleString('vi-VN', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                    })
                    : null
            }));

            setPatients(data);
            setFilteredPatients(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching patients:', error);
            setLoading(false);
        }
    };


    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        const filtered = patients.filter(patient =>
            patient.name.toLowerCase().includes(term) ||
            patient.email?.toLowerCase().includes(term) ||
            patient.phone?.toLowerCase().includes(term)
        );

        setFilteredPatients(filtered);
    };

    const viewPatientDetails = (patientId) => {
        navigate(`/doctor/patients/${patientId}`);
    };

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                    <Users className="mr-3 text-cyan-500" /> Patient Management
                </h1>
            </div>

            {/* Search and Filter */}
            <div className="flex mb-6 space-x-4">
                <div className="relative flex-grow">
                    <input
                        type="text"
                        placeholder="Search patients by name, email, or phone"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <Search className="absolute left-3 top-3.5 text-gray-400" />
                </div>
                <button className="p-3 bg-white border rounded-lg hover:bg-gray-100">
                    <Filter className="text-gray-600" />
                </button>
            </div>

            {/* Patient List */}
            {loading ? (
                <div className="text-center text-gray-500">Loading patients...</div>
            ) : filteredPatients.length === 0 ? (
                <div className="text-center text-gray-500">No patients found</div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPatients.map(patient => (
                        <div
                            key={patient.patient_id}
                            className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-800">{patient.name}</h2>
                                <button
                                    onClick={() => viewPatientDetails(patient.patient_id)}
                                    className="text-cyan-500 hover:text-cyan-600"
                                >
                                    <Eye/>
                                </button>
                            </div>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p><strong>Email:</strong> {patient.email || 'N/A'}</p>
                                <p><strong>Phone:</strong> {patient.phone || 'N/A'}</p>
                                <p>
                                    <strong>Ngày đặt:</strong>{' '}
                                    {patient.latest_appointment_date || 'No Appointments'}
                                </p>
                                <div className="flex justify-between mt-4">
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="text-cyan-500" size={16}/>
                                        <span>{patient.total_appointments} Appointments</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <FileText className="text-cyan-500" size={16}/>
                                        <span>{patient.medical_history ? 'Medical History' : 'No History'}</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PatientManagement;
