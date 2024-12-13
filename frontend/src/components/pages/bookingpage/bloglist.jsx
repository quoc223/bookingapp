import React, { useEffect, useState } from "react";
import axios from "axios";

const Card = ({ image, title, description, category, date, onClick }) => (
    <div
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-transform transform hover:scale-105 cursor-pointer"
        onClick={onClick}
    >
        <img
            src={image}
            alt={title}
            className="w-full h-48 object-cover"
        />
        <div className="p-4">
            {category && (
                <span className="text-xs font-semibold text-gray-500 uppercase">
                    {category}
                </span>
            )}
            <h2 className="mt-2 text-lg font-semibold text-gray-800 line-clamp-2">
                {title}
            </h2>
            <p className="mt-2 text-gray-600 text-sm line-clamp-3">
                {description}
            </p>
            <div className="mt-4 text-xs text-gray-500">
                {date}
            </div>
        </div>
    </div>
);

const Modal = ({ blog, onClose }) => (
    <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
    >
        <div
            className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
        >
            <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                onClick={onClose}
            >
                ×
            </button>
            <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {blog.title}
            </h2>
            <p className="text-gray-700 text-sm mb-6">{blog.content}</p>
            <div className="text-sm text-gray-500">
                <p>
                    <strong>Ngày đăng:</strong>{" "}
                    {new Date(blog.publish_date).toLocaleDateString("vi-VN")}
                </p>
                <p>
                    <strong>Tags:</strong>{" "}
                    {blog.tags ? blog.tags.join(", ") : "Không có"}
                </p>
            </div>
        </div>
    </div>
);

export default function BlogList() {
    const [blogs, setBlogs] = useState([]);
    const [selectedBlog, setSelectedBlog] = useState(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_DOMAINNAME}api/blogs`
                );
                const processedBlogs = response.data.blogs.map((blog) => ({
                    ...blog,
                    tags: blog.tags ? blog.tags.split(",").map((tag) => tag.trim()) : [],
                }));
                setBlogs(processedBlogs || []);
            } catch (error) {
                console.error("Error fetching blogs:", error);
                setBlogs([]);
            }
        };

        fetchBlogs();
    }, []);

    const getImageSrc = (image) => {
        return (
            image ||
            "https://cl-wpml.careerlink.vn/cam-nang-viec-lam/wp-content/uploads/2023/10/02083754/cheerful-asian-dentists-posing-treatment-room-clinic-front-equipment.jpg"
        );
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-bold text-center text-teal-700 mb-8">
                Danh Sách Bài Viết Y Khoa
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {blogs.map((blog) => (
                    <Card
                        key={blog.blog_id}
                        image={getImageSrc(blog.image)}
                        title={blog.title}
                        description={blog.content}
                        category="Y Khoa"
                        date={new Date(blog.publish_date).toLocaleDateString(
                            "vi-VN"
                        )}
                        onClick={() => setSelectedBlog(blog)}
                    />
                ))}
            </div>
            {selectedBlog && (
                <Modal
                    blog={selectedBlog}
                    onClose={() => setSelectedBlog(null)}
                />
            )}
        </div>
    );
}
