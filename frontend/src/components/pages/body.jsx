import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import {Card, CardBody, Typography, Button, Input} from "@material-tailwind/react";
import {Search, FileText, AlertCircle, FileSpreadsheet} from "lucide-react";
import axios from "axios";

import PatientChatWidget   from "./PatientChatWidget.jsx";

const QuickAccessButton = ({ icon, text, color }) => (
    <Button
        className={`${color} text-gray-800 py-2 px-4 rounded-lg flex items-center space-x-2 text-xs sm:text-sm hover:shadow-md transition-all duration-300`}
        variant="text"
    >
      {icon}
      <span className="hidden sm:inline">{text}</span>
    </Button>
);

const SectionTitle = ({ title, viewMoreText = "Xem thêm" }) => (
    <div className="flex justify-between items-center mb-6">
      <Typography variant="h4" className="text-lg sm:text-xl md:text-2xl font-bold">
        {title}
      </Typography>
      <Button
          color="blue"
          variant="text"
          size="sm"
          className="text-xs sm:text-sm hover:bg-blue-50"
      >
        {viewMoreText}
      </Button>
    </div>
);

const ArticleCard = ({ image, title, subtitle }) => (
    <Link to="/article" className="block hover:no-underline">
      <Card className="w-full max-w-[300px] hover:shadow-lg transition-all duration-300">
        <CardBody className="p-0">
          <img src={image} alt={title} className="w-full h-48 object-cover rounded-t-lg" />
          <div className="p-4">
            <Typography variant="h6" className="text-sm sm:text-base mb-2 line-clamp-2 hover:text-blue-600">
              {title}
            </Typography>
            <Typography variant="small" color="blue-gray" className="text-xs sm:text-sm">
              {subtitle}
            </Typography>
          </div>
        </CardBody>
      </Card>
    </Link>
);

const DoctorCard = ({ image, name, title, specialty }) => (
    <Link to="/doctor" className="block hover:no-underline">
      <div className="flex flex-col items-center p-4 hover:bg-blue-50 rounded-lg transition-all duration-300">
        <img
            src={image}
            alt={name}
            className="w-24 h-24 rounded-full mb-3 object-cover shadow-md hover:shadow-lg transition-all duration-300"
        />
        <Typography variant="h6" className="text-center text-sm sm:text-base mb-1 hover:text-blue-600">
          {name}
        </Typography>
        <Typography variant="small" color="gray" className="text-center text-xs sm:text-sm mb-1">
          {title}
        </Typography>
        <Typography variant="small" color="blue" className="text-center text-xs sm:text-sm font-medium">
          {specialty}
        </Typography>
      </div>
    </Link>
);

const ServiceCard = ({ icon, name, id }) => (
    <Link to={`/listdoctor/${id}`} className="block w-full">
      <Card className="hover:bg-blue-50 transition-all duration-300 hover:shadow-md">
        <CardBody className="flex items-center p-4">
          <span className="text-2xl sm:text-3xl mr-4">{icon}</span>
          <Typography variant="h6" className="text-sm sm:text-base hover:text-blue-600">
            {name}
          </Typography>
        </CardBody>
      </Card>
    </Link>
);

const MedicalSpecialties = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [specialities, setSpecialities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_DOMAINNAME; // Ensure this is correctly set

        const response = await axios.get(`${apiUrl}api/getspecialties`);
        setSpecialities(response.data);
      } catch (error) {
        console.error('Error fetching specialities:', error.message);

      }
    };

    fetchData();
  }, []);
  const icons = ["🏥", "📱", "📋", "🧪", "🧠", "🦷", "🏥", "🩺", "📊", "🏠"];

  return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-400 to-blue-600">
          <header className="py-8">
            <Typography variant="h4" className="text-center text-white text-2xl sm:text-3xl md:text-4xl font-bold">
              Nơi khởi nguồn sức khỏe
            </Typography>
          </header>

          {/* Search Section */}
          <div className="container mx-auto px-4 pb-8">
            <Card className="mx-auto max-w-2xl shadow-lg">
              <CardBody>
                <div className="flex items-center border-b border-gray-200 pb-3">
                  <Search className="text-gray-400 mr-3"/>
                  <Input
                      type="text"
                      placeholder="Đặt câu hỏi với Trợ lý AI"
                      className="w-full border-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center mt-3 text-gray-600 text-sm">
                  <FileText className="mr-2" size={18}/>
                  <span>Đọc đơn thuốc/ xét nghiệm</span>
                </div>
              </CardBody>
            </Card>

            {/* Quick Access Buttons */}
            <div className="flex flex-wrap gap-4 justify-center mt-6">
              <QuickAccessButton
                  icon={<AlertCircle size={16}/>}
                  text="Đau giữa đỉnh đầu dai dẳng là"
                  color="bg-yellow-100"
              />
              <QuickAccessButton
                  icon={<AlertCircle size={16}/>}
                  text="Nuốt vướng khó chịu vùng"
                  color="bg-blue-100"
              />
              <QuickAccessButton
                  icon={<FileSpreadsheet size={16}/>}
                  text="khói hoàn toàn bằng quang"
                  color="bg-green-100"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Services Grid */}
          <section className="mb-12">
            <Typography variant="h3" className="text-center text-2xl sm:text-3xl font-bold mb-8">
              Dịch vụ toàn diện
            </Typography>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {specialities.map((speciality, index) => (
                  <ServiceCard
                      key={speciality.specialty_id}
                      icon={icons[index % icons.length]} // Use icons based on index
                      name={speciality.specialty_name} // Take name from API data
                      id={speciality.specialty_id}
                  />
              ))}
            </div>
          </section>

          {/* Chat Widget */}
          <div>
           <PatientChatWidget/>
          </div>


        </div>
      </div>
  );
};

export default MedicalSpecialties;
