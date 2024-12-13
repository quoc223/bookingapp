import React from 'react';
import Header from "./header.jsx";
import Footer from "./footer.jsx";
import { Outlet } from "react-router-dom";
import './layout.css'; // Import the CSS file

const Layout = () => {
    return (
        <div className="layout-container">
            <Header />
            <div className="content">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default Layout;
