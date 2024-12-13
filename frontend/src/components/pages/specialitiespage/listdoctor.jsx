import React, { useEffect, useState } from 'react';
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

const NextArrow = ({ className, onClick }) => (
    <button
        className={`${className} `}
        onClick={onClick}
    >
        <ChevronRight className="w-6 h-6 text-gray-600" />
    </button>
);

const PrevArrow = ({ className, onClick }) => (
    <button
        className={`${className} `}
        onClick={onClick}
    >
        <ChevronLeft className="w-6 h-6 text-gray-600" />
    </button>
);

const DoctorList = () => {
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = import.meta.env.VITE_DOMAINNAME;
                const response = await axios.get(`${apiUrl}api/getdoctorsexperiences`);
                if (response.data && Array.isArray(response.data[0])) {
                    setDoctors(response.data[0]);
                } else {
                    console.error('API response is not an array of doctor objects:', response.data);
                }
            } catch (error) {
                console.error('Error fetching doctors:', error);
            }
        };
        fetchData();
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            { breakpoint: 1536, settings: { slidesToShow: 4 } },
            { breakpoint: 1280, settings: { slidesToShow: 3 } },
            { breakpoint: 768, settings: { slidesToShow: 2 } },
            { breakpoint: 640, settings: { slidesToShow: 1 } }
        ]
    };

    return (
        <div className="container mx-auto px-12 py-8">
            <Typography variant="h2" color="blue-gray" className="mb-8 text-center">
                Bác Sĩ Giàu Kinh Nghiệm
            </Typography>
            <div className="relative">
                <Slider {...settings}>
                    {doctors.map((doctor, index) => (
                        <div key={index} className="px-2 ">
                            <Link to={`/doctorprofile/${doctor.doctor_id}`} className="block">
                                <Card className="w-full h-[400px] bg-blue-200 rounded-2xl">
                                    <CardBody className="flex flex-col items-center justify-between p-6 ">
                                        <div className="w-48 h-48 rounded-full overflow-hidden mb-4">
                                            <img
                                                src={doctor.image || "/api/placeholder/192/192"}
                                                alt={doctor.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="text-center space-y-2">
                                            <Typography variant="h6" color="blue-gray">
                                                {doctor.name}
                                            </Typography>
                                            <Typography color="light-blue" className="font-extralight" textGradient>
                                                {doctor.specialty_name}
                                            </Typography>
                                            <Typography variant="small" color="gray" className="font-normal">
                                                {doctor.years_of_experience} năm kinh nghiệm
                                            </Typography>
                                            <Typography
                                                variant="small"
                                                color="green"
                                                className="flex items-center justify-center gap-1 font-normal"
                                            >
                                                <span className="h-3 w-3 rounded-full bg-green-500"></span>
                                                {doctor.status === "HOME"
                                                    ? "Khám tại nhà"
                                                    : doctor.status === "HOSPITAL"
                                                        ? "Khám tại phòng khám"
                                                        : "Khám tại nhà và phòng khám"}
                                            </Typography>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Link>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
};

export default DoctorList;
