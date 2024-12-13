import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import DoctorCard from "./doctorcard.jsx";

const DoctorListing = () => {
    const { specialtyId } = useParams();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                setLoading(true);
                const apiUrl = import.meta.env.VITE_DOMAINNAME;
                const response = await axios.get(`${__DOMAINNAME__}api/getdoctorspecialties/${specialtyId}`);

                if (response.data && Array.isArray(response.data[0])) {
                    setDoctors(response.data[0]);
                } else {
                    throw new Error('Invalid data format received from server');
                }
            } catch (error) {
                console.error('Error fetching doctors:', error);
                setError('Không thể tải danh sách bác sĩ. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, [specialtyId]);

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto p-4 text-center">
                <div className="animate-pulse">
                    <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-32 bg-gray-200 rounded-lg"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-6xl mx-auto p-4 text-center text-red-600">
                <p>{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    if (doctors.length === 0) {
        return (
            <div className="max-w-6xl mx-auto p-4 text-center text-gray-600">
                <p>Không tìm thấy bác sĩ nào trong chuyên khoa này.</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                Danh sách bác sĩ ({doctors.length})
            </h2>
            {doctors.map((doctor) => (
                <DoctorCard key={doctor.doctor_id} doctor={doctor} />
            ))}
        </div>
    );
};

export default DoctorListing;
