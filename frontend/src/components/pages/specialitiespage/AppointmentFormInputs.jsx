import React from 'react';

const AppointmentFormInputs = ({
                                   formData,
                                   handleInputChange,
                                   provinces,
                                   districts,
                                   wards,
                                   selectedProvince,
                                   selectedDistrict,
                                   selectedWard,
                                   detailedAddress,
                                   handleProvinceChange,
                                   handleDistrictChange,
                                   handleWardChange,
                                   setDetailedAddress,
                                   getFullAddress,

                               }) => {
    return (
        <div className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
                <input
                    type="text"
                    name="name"  // Changed from namePatient to name
                    placeholder="Tên Bênh Nhân"
                    value={formData.name}  // Changed from namePatient to name
                    onChange={handleInputChange}
                    className="block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                />

                <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                />

                <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                >
                    <option value="Male">Nam</option>
                    <option value="Female">Nữ</option>
                </select>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                />

                <input
                    type="tel"
                    name="phone"
                    placeholder="Số Điện Thoại"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                />
            </div>

            {/* Emergency Contact */}
            <div className="space-y-4">
                <input
                    type="text"
                    name="emergencyContact"
                    placeholder="Tên Người Liên Hệ Khẩn Cấp"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    className="block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                <input
                    type="tel"
                    name="emergencyPhone"
                    placeholder="Số Điện Thoại Người Liên Hệ Khẩn Cấp"
                    value={formData.emergencyPhone}
                    onChange={handleInputChange}
                    className="block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            {/* Address Section */}
            <div className="space-y-4">
                <select
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={selectedProvince}
                    onChange={handleProvinceChange}
                    required
                >
                    <option value="">-- Chọn Tỉnh/Thành Phố --</option>
                    {provinces.map(province => (
                        <option key={province.code} value={province.code}>
                            {province.name}
                        </option>
                    ))}
                </select>

                <select
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                    disabled={!selectedProvince}
                    required
                >
                    <option value="">-- Chọn Huyện --</option>
                    {districts.map(district => (
                        <option key={district.code} value={district.code}>
                            {district.name}
                        </option>
                    ))}
                </select>

                <select
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={selectedWard}
                    onChange={handleWardChange}
                    disabled={!selectedDistrict}
                    required
                >
                    <option value="">-- Chọn Xã --</option>
                    {wards.map(ward => (
                        <option key={ward.code} value={ward.code}>
                            {ward.name}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Detailed Address (House number, Street)"
                    value={detailedAddress}
                    onChange={(e) => setDetailedAddress(e.target.value)}
                    className="block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                />

                {getFullAddress() && (
                    <div className="text-sm text-gray-600">
                        Địa chỉ: {getFullAddress()}
                    </div>
                )}
            </div>

            {/* Medical History & Notes */}
            <div className="space-y-4">
                <textarea
                    name="medicalHistory"
                    placeholder="Lịch Sử Bệnh Án"
                    value={formData.medicalHistory}
                    onChange={handleInputChange}
                    rows={4}
                    className="block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                <textarea
                    name="notes"
                    placeholder="Ghi Chú"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={4}
                    className="block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                />
            </div>
        </div>
    );
};

export default AppointmentFormInputs;
