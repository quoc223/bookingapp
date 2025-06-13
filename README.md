Purpose and Scope
This document provides a comprehensive overview of the Vietnamese medical appointment booking system, a web-based platform that facilitates online healthcare consultations and appointment scheduling. This overview covers the system's core purpose, user roles, architecture, and technology stack. For detailed technical architecture information, see System Architecture. For specific backend API implementation details, see Backend API.

System Description
The Vietnamese medical appointment booking system is a full-stack web application designed to streamline healthcare services by enabling patients to book appointments with doctors, conduct online consultations, and manage their medical interactions digitally. The system supports Vietnamese language interfaces and integrates with local payment systems to serve the Vietnamese healthcare market.

Key Features
Feature Category	Capabilities
Patient Management	Account registration, profile management, appointment booking, online consultation
Doctor Services	Schedule management, patient management, blog publishing, online diagnosis
Administrative Functions	System monitoring, user management, security oversight, technical support
Payment Processing	VNPAY integration for secure payment transactions
Content Management	Blog system, AI-powered chat consultations, review system
External Integrations	Image storage via Cloudinary, Vietnamese address APIs, AI chat services
Sources: 
README.md
1-40

User Roles and Responsibilities
The system implements role-based access control with three distinct user types, each with specific capabilities and access permissions.

User Role Distribution
Vietnamese Medical Booking System

Bệnh Nhân (Patient)

Bác Sĩ (Doctor)

Quản Trị Viên (Admin)

• Account registration
• Appointment booking
• Profile management
• Online consultation

• Schedule management
• Patient management
• Blog publishing
• Online diagnosis

• System monitoring
• User management
• Security oversight
• Technical support

Sources: 
README.md
11-39

Role-Based Controller Mapping
Backend Controllers

User Roles

Bệnh Nhân
(Patient)

Bác Sĩ
(Doctor)

Quản Trị Viên
(Admin)

patientController

doctorController

authController

appointmentController

blogController

chatController

dashboardController

paymentController

reviewController

Sources: 
README.md
11-39
 Backend controller files structure

Technology Stack
Core Technologies
Layer	Technology	Purpose
Frontend	ReactJS + TailwindCSS	User interface and responsive design
Backend	NodeJS + ExpressJS	REST API server and business logic
Database	MySQL	Data persistence and stored procedures
Authentication	JWT + bcrypt	Secure user authentication and authorization
Payment	VNPAY	Vietnamese payment gateway integration
Development Environment
The project follows standard Node.js project structure with separate frontend and backend directories, as evidenced by the .gitignore configuration that excludes node_modules from both /frontend/ and /backend/ directories, along with environment files.

Sources: 
README.md
3-7
 
.gitignore
7-9

High-Level System Architecture
Three-Tier Architecture Overview
External Services

Data Layer

Application Layer

Presentation Layer

HTTP/HTTPS

Payment Processing

Image Upload

Chat Consultation

Address Data

Frontend Application
ReactJS + TailwindCSS
Port: 3000

Backend API Server
NodeJS + ExpressJS

Authentication System
JWT + bcrypt

Middleware Stack
auth.js, authentication.js

MySQL Database
Connection Pool

Stored Procedures

VNPAY Payment Gateway

Cloudinary Image Storage

AI Chat Service

Vietnamese Address API

Sources: 
README.md
3-7
 project structure analysis

External Integrations
The system integrates with several external services to provide comprehensive functionality:

Integration Points
Service	Purpose	Implementation
VNPAY	Payment processing for appointment fees	Sandbox environment for development
Cloudinary	Image storage and management	Profile pictures, blog images
AI Chat Service	Automated consultation support	Mistral-7B model integration
Vietnamese Address API	Location data for user profiles	Province/District/Ward hierarchy
Configuration Management
The system uses environment-based configuration management with separate .env files for different deployment environments, ensuring secure handling of API keys and connection strings for external services.

Sources: 
README.md
7
 
.gitignore
7
 system architecture analysis

Project Structure
The codebase follows a standard separation of concerns with distinct frontend and backend applications. The backend implements a RESTful API architecture with role-based authentication, while the frontend provides a responsive user interface for the three user types. For detailed information about the backend API structure and endpoints, see Backend API.

Sources: 
.gitignore
8-9
 overall project analysis
