import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Card,
    CardHeader,
    Typography,
    Button,
    CardBody,
    CardFooter,
    IconButton,
    Tooltip,
    Input,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import {
    MagnifyingGlassIcon,
    PencilIcon,
    TrashIcon,
    EyeIcon
} from "@heroicons/react/24/solid";

const TABLE_HEAD = ["ID", "Tên", "Email", "Số Điện Thoại", "Trạng Thái", "Lần Đăng Nhập Cuối", "Hành Động"];

function PatientManagements() {
    const [patients, setPatients] = useState([]);
    const [pagination, setPagination] = useState({
        total_pages: 1,
        total_records: 0
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [openDetailDialog, setOpenDetailDialog] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({ name: '', email: '', phone: '', status: '', last_login: '' });
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchPatients = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${__DOMAINNAME__}api/listpatientaccount`, {
                    params: {
                        page: currentPage,
                        pageSize: 10,
                        searchTerm: searchTerm
                    }
                });

                setPatients(response.data.patients);
                setPagination(response.data.pagination);
            } catch (err) {
                console.error('Error fetching patients:', err);
                setError('Không thể tải danh sách bệnh nhân');
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, [currentPage, searchTerm]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const handleViewDetails = (patient) => {
        setSelectedPatient(patient);
        setOpenDetailDialog(true);
    };

    const handleEditPatient = (patient) => {
        setForm({
            name: patient.name,
            email: patient.email,
            phone: patient.phone,
            status: patient.status,
            last_login: patient.last_login
        });
        setOpen(true);
    };

    const handleDeletePatient = async (patientId) => {
        try {
            await axios.delete(`${__DOMAINNAME__}api/deletepatient/${patientId}`);
            setPatients(patients.filter(p => p.patient_id !== patientId));
        } catch (error) {
            console.error('Error deleting patient:', error);
            alert('Không thể xóa bệnh nhân');
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${__DOMAINNAME__}api/updatepatient/${selectedPatient.patient_id}`, form);
            setPatients(patients.map(p => p.patient_id === selectedPatient.patient_id ? { ...p, ...form } : p));
            setOpen(false);
        } catch (error) {
            console.error('Error updating patient:', error);
            alert('Không thể cập nhật bệnh nhân');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Chưa đăng nhập';
        return new Date(dateString).toLocaleString('vi-VN');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Typography>Đang tải...</Typography>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-full text-red-500">
                <Typography color="red">{error}</Typography>
            </div>
        );
    }

    return (
        <Card className="h-full w-full">
            <CardHeader floated={false} shadow={false} className="rounded-none">
                <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center ">
                    <div>
                        <Typography variant="h5" color="blue-gray">
                            Quản Lý Tài Khoản Bệnh Nhân
                        </Typography>
                        <Typography color="gray" className="mt-1 font-normal">
                            Danh sách tài khoản bệnh nhân
                        </Typography>
                    </div>
                    <div className="flex w-full shrink-0 gap-2 md:w-max">
                        <div className="w-full md:w-72">
                            <Input
                                label="Tìm kiếm"
                                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                        <Button className="flex items-center gap-3" size="sm">
                            Thêm Bệnh Nhân
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardBody className="overflow-scroll px-0">
                <table className="w-full min-w-max table-auto text-left">
                    <thead>
                    <tr>
                        {TABLE_HEAD.map((head) => (
                            <th key={head} className="border-y border-blue-gray-100 bg-blue-gray-50 p-4">
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal leading-none opacity-70"
                                >
                                    {head}
                                </Typography>
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {patients.map((patient) => (
                        <tr key={patient.patient_id} className="hover:bg-blue-gray-50">
                            <td className="p-4">
                                <Typography variant="small" color="blue-gray" className="font-normal">
                                    {patient.patient_id}
                                </Typography>
                            </td>
                            <td className="p-4">
                                <Typography variant="small" color="blue-gray" className="font-normal">
                                    {patient.name}
                                </Typography>
                            </td>
                            <td className="p-4">
                                <Typography variant="small" color="blue-gray" className="font-normal">
                                    {patient.email}
                                </Typography>
                            </td>
                            <td className="p-4">
                                <Typography variant="small" color="blue-gray" className="font-normal">
                                    {patient.phone || 'Chưa cập nhật'}
                                </Typography>
                            </td>
                            <td className="p-4">
                                <Typography
                                    variant="small"
                                    color={patient.status === 'ACTIVE' ? 'green' : 'red'}
                                    className="font-normal"
                                >
                                    {patient.status}
                                </Typography>
                            </td>
                            <td className="p-4">
                                <Typography variant="small" color="blue-gray" className="font-normal">
                                    {formatDate(patient.last_login)}
                                </Typography>
                            </td>
                            <td className="p-4">
                                <div className="flex items-center gap-2">
                                    <Tooltip content="Xem chi tiết">
                                        <IconButton
                                            variant="text"
                                            color="blue-gray"
                                            onClick={() => handleViewDetails(patient)}
                                        >
                                            <EyeIcon className="h-4 w-4" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip content="Chỉnh sửa">
                                        <IconButton
                                            variant="text"
                                            color="blue-gray"
                                            onClick={() => handleEditPatient(patient)}
                                        >
                                            <PencilIcon className="h-4 w-4" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip content="Xóa">
                                        <IconButton
                                            variant="text"
                                            color="red"
                                            onClick={() => handleDeletePatient(patient.patient_id)}
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </CardBody>
            <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                <Typography variant="small" color="blue-gray" className="font-normal">
                    Trang {currentPage} / {pagination.total_pages}
                </Typography>
                <div className="flex gap-2">
                    <Button
                        variant="outlined"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    >
                        Trước
                    </Button>
                    <Button
                        variant="outlined"
                        size="sm"
                        disabled={currentPage === parseInt(pagination.total_pages)}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                        Tiếp
                    </Button>
                </div>
            </CardFooter>

            {/* Patient Details Dialog */}
            {selectedPatient && (
                <Dialog
                    open={openDetailDialog}
                    handler={() => setOpenDetailDialog(false)}
                    size="md"
                >
                    <DialogHeader>Chi Tiết Bệnh Nhân</DialogHeader>
                    <DialogBody divider>
                        <div className="grid grid-cols-2 gap-4">
                            <Typography variant="h6" color="blue-gray">
                                Mã Bệnh Nhân:
                            </Typography>
                            <Typography>{selectedPatient.patient_id}</Typography>

                            <Typography variant="h6" color="blue-gray">
                                Tên:
                            </Typography>
                            <Typography>{selectedPatient.name}</Typography>

                            <Typography variant="h6" color="blue-gray">
                                Email:
                            </Typography>
                            <Typography>{selectedPatient.email}</Typography>

                            <Typography variant="h6" color="blue-gray">
                                Số Điện Thoại:
                            </Typography>
                            <Typography>{selectedPatient.phone || 'Chưa cập nhật'}</Typography>

                            <Typography variant="h6" color="blue-gray">
                                Trạng Thái:
                            </Typography>
                            <Typography color={selectedPatient.status === 'ACTIVE' ? 'green' : 'red'}>
                                {selectedPatient.status}
                            </Typography>

                            <Typography variant="h6" color="blue-gray">
                                Lần Đăng Nhập Cuối:
                            </Typography>
                            <Typography>
                                {formatDate(selectedPatient.last_login)}
                            </Typography>
                        </div>
                    </DialogBody>
                    <DialogFooter>
                        <Button
                            variant="text"
                            color="red"
                            onClick={() => setOpenDetailDialog(false)}
                            className="mr-1"
                        >
                            <span>Đóng</span>
                        </Button>
                    </DialogFooter>
                </Dialog>
            )}

            {/* Edit Patient Dialog */}
            <Dialog
                open={open}
                handler={() => setOpen(false)}
                size="md"
            >
                <DialogHeader>Chỉnh Sửa Bệnh Nhân</DialogHeader>
                <form onSubmit={handleFormSubmit}>
                    <DialogBody divider>
                        <div className="grid grid-cols-2 gap-4 ">
                            <label>Tên</label>
                            <Input

                                name="name"
                                value={form.name}
                                onChange={handleFormChange}
                            />
                            <label>Email</label>
                            <Input
                                name="email"
                                value={form.email}
                                onChange={handleFormChange}
                            />
                            <label>Số điện thoại</label>
                            <Input
                                name="phone"
                                value={form.phone}
                                onChange={handleFormChange}
                            />
                            <label>Trạng thái</label>
                            <Input
                                name="status"
                                value={form.status}
                                onChange={handleFormChange}
                            />
                            <label>Lần Đăng Nhập Cuối</label>
                            <Input
                                name="last_login"
                                value={form.last_login}
                                onChange={handleFormChange}
                            />
                        </div>
                    </DialogBody>
                    <DialogFooter>
                        <Button
                            variant="text"
                            color="white"
                            onClick={() => setOpen(false)}
                            className="mr-1 bg-blue-500"
                        >
                            <span>Hủy</span>
                        </Button>
                        <Button
                            variant="gradient"
                            color="white"
                            type="submit"
                            className="bg-blue-500"
                        >
                            <span>Lưu</span>
                        </Button>
                    </DialogFooter>
                </form>
            </Dialog>
        </Card>
    );
}

export default PatientManagements;
