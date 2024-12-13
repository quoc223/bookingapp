import { useState } from 'react';
import { assets } from '../../assets/assets';
import { Menu, Handshake, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import useAuth from '../../middleware/useAuth';
import axios from 'axios';

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();

  const sidebarLinks = [
    'Cẩm nang',
    'Liên hệ hợp tác',
    'VỀ PRESCRIPTO',
    'Vai trò của PRESCRIPTO',
    'Liên hệ',
  ];

  const userMenuLinks = [
    { label: 'Dashboard', link: '/doctor/dashboard' },
    { label: 'Profile', link: '/profile' },
  ];

  // Logout handler
  const handleLogout = async () => {
    try {
      // Clear token from cookies
      Cookies.remove('token');

      // Call the logout API (optional, but recommended for session handling)
      const logoutUrl = `${import.meta.env.VITE_DOMAINNAME}api/logout`;

      await axios.post(logoutUrl, {}, {
        withCredentials: true, // Ensures cookies are sent with the request
      });

      // Redirect to login page
      navigate('/login');

      // Optionally reload the page to reset state completely
      window.location.reload();
    } catch (error) {
      console.error('Error during logout:', error.response?.data || error.message);
      // Fallback navigation in case of error
      navigate('/login');
    }
  };

  // Navigate to login page
  const handleClickLogin = () => {
    navigate('/login');
  };

  return (
      <div className="relative">
        <header className="bg-cyan-50 shadow-sm">
          <div className="container mx-auto px-4 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Menu
                  className="text-gray-600 h-6 w-6 cursor-pointer"
                  onClick={() => setIsSidebarOpen(true)}
              />
              <Link to="/" className="flex items-center">
                <img src={assets.logo} alt="BookingCare" className="h-8" />
              </Link>
            </div>

            <nav className="hidden md:flex space-x-4">
              <button className="bg-yellow-400 text-white px-4 py-2 rounded-full font-semibold">
                Tất cả
              </button>
              <Link to="/" className="text-gray-600 px-4 py-2 rounded-full font-semibold">
                Trang Chủ
              </Link>
              <Link to="/" className="text-gray-600 px-4 py-2 rounded-full font-semibold">
                Dành Cho Bệnh Nhân
              </Link>
              <Link to="/doctor/login" className="text-gray-600 px-4 py-2 rounded-full font-semibold">
                Dành Cho Bác Sĩ
              </Link>

              {/* Display user menu links only for authenticated users with the role 'doctor' */}
              {!isLoading && isAuthenticated && user?.role === 'DOCTOR' && (
                  <>
                    {userMenuLinks.map((link, index) => (
                        <Link
                            key={index}
                            to={link.link}
                            className="text-gray-600 px-4 py-2 rounded-full font-semibold"
                        >
                          {link.label}
                        </Link>
                    ))}
                  </>
              )}
            </nav>

            <div className="flex items-center space-x-4">
              <button
                  onClick={() => navigate('/contact')}
                  className="flex items-center space-x-1 text-cyan-500"
              >
                <Handshake className="h-5 w-5" />
                <span className="hidden md:inline">Hợp tác</span>
              </button>

              {/* Authentication state handling */}
              {isLoading ? (
                  // Loading state
                  <div className="animate-pulse">Đang tải...</div>
              ) : isAuthenticated ? (
                  <div className="flex items-center space-x-2">
                    <img
                        src={user?.avatar || assets.DoctorAvatar}
                        alt="User Avatar"
                        className="w-8 h-8 rounded-full object-cover"
                    />
                    <button
                        className="flex items-center space-x-1 text-cyan-500"
                        onClick={handleLogout}
                    >
                      <span className="hidden md:inline">Đăng Xuất</span>
                    </button>
                  </div>
              ) : (
                  <button
                      className="flex items-center space-x-1 text-cyan-500"
                      onClick={handleClickLogin}
                  >
                    <span className="hidden md:inline">Đăng Nhập</span>
                  </button>
              )}
            </div>
          </div>
        </header>

        {/* Sidebar remains the same as in your original code */}
        <div
            className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } transition-transform duration-300 ease-in-out z-50`}
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-6">
              <img src={assets.logo} alt="BookingCare" className="h-8" />
              <X
                  className="h-6 w-6 text-gray-600 cursor-pointer"
                  onClick={() => setIsSidebarOpen(false)}
              />
            </div>
            <nav>
              <ul className="space-y-2">
                {sidebarLinks.map((link, index) => (
                    <li key={index}>
                      <Link
                          to={`/${link.toLowerCase().replace(/\s+/g, '-')}`}
                          className="block py-2 text-sm text-gray-600 hover:text-cyan-500 transition duration-150 ease-in-out"
                      >
                        {link}
                      </Link>
                    </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Overlay */}
        {isSidebarOpen && (
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={() => setIsSidebarOpen(false)}
            ></div>
        )}
      </div>
  );
};

export default Header;
