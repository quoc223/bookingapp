import React from 'react';
import {
    Card,
    CardBody,
    Typography,
    Button
} from "@material-tailwind/react";
import {
    UserIcon,
    ChartBarIcon,
    ClipboardDocumentListIcon,
    CurrencyDollarIcon
} from "@heroicons/react/24/solid";

// Dashboard Card Component
const DashboardCard = ({ icon, title, value, percentage, color }) => (
    <Card className="shadow-lg">
        <CardBody className="flex items-center justify-between">
            <div>
                <Typography variant="h5" color="blue-gray" className="mb-2">
                    {value}
                </Typography>
                <Typography variant="small" className="text-gray-600">
                    {title}
                </Typography>
                <div className={`text-sm font-bold ${color}`}>
                    {percentage > 0 ? `+${percentage}%` : `${percentage}%`}
                </div>
            </div>
            <div className={`rounded-full p-3 ${color} bg-opacity-10`}>
                {icon}
            </div>
        </CardBody>
    </Card>
);

export default function Dashboard() {
    const dashboardStats = [
        {
            icon: <UserIcon className="h-6 w-6 text-blue-500" />,
            title: "New Patients",
            value: 890,
            percentage: 40,
            color: "text-green-500"
        },
        {
            icon: <ChartBarIcon className="h-6 w-6 text-green-500" />,
            title: "OPD Patients",
            value: 360,
            percentage: 30,
            color: "text-blue-500"
        },
        {
            icon: <ClipboardDocumentListIcon className="h-6 w-6 text-red-500" />,
            title: "Lab Tests",
            value: 980,
            percentage: 60,
            color: "text-red-500"
        },
        {
            icon: <CurrencyDollarIcon className="h-6 w-6 text-yellow-500" />,
            title: "Total Earnings",
            value: "$98,000",
            percentage: 20,
            color: "text-yellow-500"
        }
    ];

    const quickStatsData = [
        { title: "Appointments", value: 639 },
        { title: "Doctors", value: 83 },
        { title: "Staff", value: 296 },
        { title: "Operations", value: 49 },
        { title: "Admitted", value: 372 },
        { title: "Discharged", value: 253 }
    ];

    return (
        <div className="space-y-6 max-w-full bg-amber-200">
            {/* Welcome Card */}
            <Card className="bg-gradient-to-r from-blue-500 to-blue-700 text-white w-full">
                <CardBody className="flex justify-between items-center">
                    <div>
                        <Typography variant="h4" className="mb-2">
                            Good Morning, Dr. Patrick Kim
                        </Typography>
                        <Typography variant="paragraph">
                            Your schedule today looks great. You're all set!
                        </Typography>
                        <div className="mt-4 flex space-x-4">
                            <div className="bg-blue-600 p-3 rounded-lg text-center">
                                <Typography variant="h6">9</Typography>
                                <Typography variant="small">Patients</Typography>
                            </div>
                            <div className="bg-green-500 p-3 rounded-lg text-center">
                                <Typography variant="h6">3</Typography>
                                <Typography variant="small">Surgeries</Typography>
                            </div>
                            <div className="bg-orange-500 p-3 rounded-lg text-center">
                                <Typography variant="h6">2</Typography>
                                <Typography variant="small">Discharges</Typography>
                            </div>
                        </div>
                    </div>
                    <img
                        src="https://placehold.co/200x200"
                        alt="Doctor"
                        className="w-48 h-48 object-cover rounded-lg max-md:hidden"
                    />
                </CardBody>
            </Card>

            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardStats.map((stat, index) => (
                    <DashboardCard key={index} {...stat} />
                ))}
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {quickStatsData.map((stat, index) => (
                    <Card key={index} className="shadow-md">
                        <CardBody className="text-center">
                            <Typography variant="h5" color="blue-gray">
                                {stat.value}
                            </Typography>
                            <Typography variant="small" className="text-gray-600">
                                {stat.title}
                            </Typography>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    );
}
