import React from 'react';
import Body  from "./body.jsx";
import DoctorList from "./specialitiespage/listdoctor.jsx";
import BlogCarousel from "./bookingpage/bloglist.jsx";
const HomePage = () => {
    return (
        <div>

            <Body/>
            <DoctorList/>
            <BlogCarousel/>

        </div>
    );
};

export default HomePage;
