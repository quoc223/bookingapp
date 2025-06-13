# Booking App – Vietnamese Medical Appointment System

📖 *A full-stack web-based platform for online healthcare consultations and appointment scheduling in Vietnam.*

---

## 🧭 Purpose and Scope

This document provides a comprehensive overview of the Vietnamese medical appointment booking system — a web application that enables patients to book appointments, consult doctors online, and manage healthcare digitally.

- Language: Vietnamese interface
- Target: Vietnamese healthcare market
- Payment: Local gateways (VNPAY)

---

## 🔑 Key Features

| Category               | Capabilities                                                                 |
|------------------------|------------------------------------------------------------------------------|
| Patient Management     | Account registration, profile management, appointment booking, consultation  |
| Doctor Services        | Schedule & patient management, blog publishing, online diagnosis             |
| Admin Functions        | System monitoring, user management, security, support                        |
| Payment Processing     | VNPAY integration for secure transactions                                    |
| Content Management     | Blog system, AI-powered chat, review system                                  |
| External Integrations  | Cloudinary for image storage, address APIs, AI chat services                 |

---

## 👥 User Roles and Responsibilities

Role-based access control with three user types:

- **Patient (Bệnh Nhân):** Register, book appointments, manage profile, consult online  
- **Doctor (Bác Sĩ):** Manage schedule/patients, publish blog, online diagnosis  
- **Admin (Quản Trị Viên):** Monitor system, manage users, security, technical support  

---

## 🧩 Role-Based Backend Controllers

| Controller             | Role(s)            |
|------------------------|--------------------|
| `authController`       | All                |
| `patientController`    | Patient            |
| `doctorController`     | Doctor             |
| `appointmentController`| Patient, Doctor    |
| `blogController`       | Doctor             |
| `chatController`       | Patient, Doctor    |
| `dashboardController`  | Admin              |
| `paymentController`    | Patient            |
| `reviewController`     | Patient            |

---

## 🧱 Technology Stack

| Layer           | Technology               | Purpose                                      |
|-----------------|--------------------------|----------------------------------------------|
| Frontend        | ReactJS + TailwindCSS    | UI and responsive layout                     |
| Backend         | NodeJS + ExpressJS       | REST API and core business logic             |
| Database        | MySQL                    | Data storage and stored procedures           |
| Authentication  | JWT + bcrypt             | Secure login and role-based access           |
| Payment         | VNPAY                    | Vietnamese payment gateway integration       |

---

## ⚙️ Development Environment

- Structured as a Node.js monorepo (`/frontend` and `/backend`)
- `.gitignore` excludes `node_modules` and `.env` files
- Uses environment-based config for secure API key handling

---

## 🧠 High-Level System Architecture

```text
External Services
 └── Cloudinary (Image Upload)
 └── VNPAY (Payments)
 └── AI Chat (Consultation)
 └── Vietnamese Address API

Presentation Layer
 └── ReactJS + TailwindCSS (Port 3000)

Application Layer
 └── NodeJS + ExpressJS
 └── JWT Auth + bcrypt
 └── Role-based Middleware

Data Layer
 └── MySQL Database (Connection Pool + Stored Procedures)
