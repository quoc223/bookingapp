import React, {useRef} from "react";
import { Input, Select, Option } from "@material-tailwind/react";

const DoctorAccountForm = ({
                               formData,
                               errors,
                               handleInputChange,
                               handleSpecialtyChange,
                               handleHospitalChange,
                               handleFileChange, // Thêm prop mới để xử lý file
                           }) => {
    const specialties = ["Nội Khoa", "Ngoại Khoa", "Sản Phụ Khoa", "Nhi Khoa"];
    const hospitals = ["Bệnh Viện Đại Học Y Dược", "Bệnh Viện Chợ Rẫy"];
    const fileInputRef = useRef(null);
    return (
        <div className="space-y-4">
            {/* Username */}
            <div>
                <label>Username</label>
                <Input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    error={!!errors.username}

                />
                {errors.username && (
                    <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                )}
            </div>

            {/* Password */}
            <div>
                <label>Password</label>
                <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    error={!!errors.password}

                />
                {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
            </div>

            <div>
                <label>Full Name</label>
                <Input

                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}

                />
                {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
            </div>
            <div>
                <label>Email</label>
                <Input

                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}

                />
                {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
            </div>
            <div>
                <label>Phone Number</label>
                <Input

                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}

                />
                {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
            </div>
            {/* Specialty */}
            <div>
                <label>Specialty</label>
                <Select
                    name="specialtyName"
                    value={formData.specialtyName}
                    onChange={(value) => handleSpecialtyChange(value)}
                >
                    {specialties.map((specialty) => (
                        <Option key={specialty} value={specialty}>
                            {specialty}
                        </Option>
                    ))}
                </Select>
            </div>

            {/* Hospital */}
            <div>
                <label>Hospital</label>
                <Select
                    name="hospitalName"
                    value={formData.hospitalName}
                    onChange={(value) => handleHospitalChange(value)}
                >
                    {hospitals.map((hospital) => (
                        <Option key={hospital} value={hospital}>
                            {hospital}
                        </Option>
                    ))}
                </Select>
            </div>

            {/* Years of Experience */}
            <div>
                <label>Years of Experience</label>
                <Input
                    type="number"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleInputChange}
                    error={!!errors.yearsOfExperience}

                />
            </div>

            {/* Bio */}
            <div>
                <label>Professional Bio</label>
                <Input
                    type="textarea"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={3}
                />
            </div>
            {/* Thay đổi phần upload image */}
            <div>
                <label>Upload image</label>
                <Input
                    type="file"
                    name="imageUrl"
                    accept="image/*" // Chỉ cho phép file ảnh
                    ref={fileInputRef}
                    onChange={(e) => handleFileChange(e)}
                />
                {formData.imageUrl && (
                    <div className="mt-2">
                        <img
                            src={
                                formData.imageUrl instanceof File
                                    ? URL.createObjectURL(formData.imageUrl)
                                    : formData.imageUrl
                            }
                            alt="Preview"
                            className="h-20 w-20 object-cover rounded-md"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorAccountForm;
