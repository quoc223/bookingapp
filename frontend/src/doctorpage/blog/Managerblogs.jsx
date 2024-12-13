import React, { useState, useEffect } from 'react';
import {
    Card,
    Typography,
    Input,
    Textarea,
    Button,
    Alert,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter
} from "@material-tailwind/react";
import {
    PencilIcon,
    TagIcon,
    TrashIcon,
    PhotoIcon,
    DocumentTextIcon
} from "@heroicons/react/24/solid";
import axios from 'axios';

export default function BlogManagement() {
    const [blogPost, setBlogPost] = useState({
        blog_id: null,
        title: '',
        content: '',
        tags: '',
        image: ''
    });
    const [blogs, setBlogs] = useState([]);
    const [errors, setErrors] = useState({});
    const [submitStatus, setSubmitStatus] = useState({
        success: false,
        error: false,
        message: ''
    });
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [blogToDelete, setBlogToDelete] = useState(null);

    // Fetch blogs on component mount
    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_DOMAINNAME}api/blogs`);
            setBlogs(response.data.blogs);
        } catch (error) {
            console.error('Error fetching blogs:', error);
            setSubmitStatus({
                success: false,
                error: true,
                message: 'Không thể tải danh sách bài viết'
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!blogPost.title.trim()) newErrors.title = "Tiêu đề không được để trống";
        if (!blogPost.content.trim()) newErrors.content = "Nội dung không được để trống";
        if (!blogPost.tags.trim()) newErrors.tags = "Vui lòng nhập ít nhất một từ khóa";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBlogPost(prevState => ({
            ...prevState,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset previous status
        setSubmitStatus({ success: false, error: false, message: '' });

        // Validate form
        if (!validateForm()) return;

        try {
            // Determine if it's a new post or an update
            const apiUrl = blogPost.blog_id
                ? `${import.meta.env.VITE_DOMAINNAME}api/blogs/${blogPost.blog_id}`
                : `${import.meta.env.VITE_DOMAINNAME}api/blog`;

            const method = blogPost.blog_id ? 'put' : 'post';

            const response = await axios[method](apiUrl, {
                ...blogPost,
                tags: blogPost.tags.split(',').map(tag => tag.trim())
            });

            setSubmitStatus({
                success: true,
                error: false,
                message: blogPost.blog_id
                    ? 'Bài viết đã được cập nhật thành công'
                    : 'Bài viết đã được tạo thành công'
            });

            // Refresh blogs list
            fetchBlogs();

            // Reset form
            setBlogPost({
                blog_id: null,
                title: '',
                content: '',
                tags: '',
                image: ''
            });
        } catch (error) {
            setSubmitStatus({
                success: false,
                error: true,
                message: 'Không thể tạo/cập nhật bài viết. Vui lòng thử lại.'
            });
            console.error('Error creating/updating blog post:', error);
        }
    };

    const handleEditBlog = (blog) => {
        setBlogPost({
            blog_id: blog.blog_id,
            title: blog.title,
            content: blog.content,
            tags: blog.tags,
            image: blog.image || ''
        });
    };

    const handleDeleteBlog = async () => {
        if (!blogToDelete) return;

        try {
            await axios.delete(`${import.meta.env.VITE_DOMAINNAME}api/blogs/${blogToDelete}`);

            setSubmitStatus({
                success: true,
                error: false,
                message: 'Bài viết đã được xóa thành công'
            });

            // Refresh blogs list
            fetchBlogs();

            // Close delete dialog and reset
            setDeleteDialogOpen(false);
            setBlogToDelete(null);

            // Reset form
            setBlogPost({
                blog_id: null,
                title: '',
                content: '',
                tags: '',
                image: ''
            });
        } catch (error) {
            setSubmitStatus({
                success: false,
                error: true,
                message: 'Không thể xóa bài viết. Vui lòng thử lại.'
            });
            console.error('Error deleting blog post:', error);
        }
    };

    return (
        <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Blog Creation/Edit Form */}
            <Card className="p-6 bg-blue-50 border-2 border-blue-100 h-fit">
                <div className="flex items-center mb-6">
                    <PencilIcon className="h-8 w-8 text-blue-600 mr-3" />
                    <Typography variant="h4" color="blue-gray" className="font-bold">
                        {blogPost.blog_id ? 'Chỉnh Sửa Bài Viết' : 'Viết Bài Blog Y Khoa'}
                    </Typography>
                </div>

                <form onSubmit={handleSubmit} className="space-y-9">
                    <div>
                        <label>Tiêu đề bài viết</label>
                        <Input
                            name="title"
                            value={blogPost.title}
                            onChange={handleInputChange}
                            color="blue"
                            error={!!errors.title}
                            className="bg-white"
                        />
                        {errors.title && (
                            <Typography variant="small" color="red" className="mt-1">
                                {errors.title}
                            </Typography>
                        )}
                    </div>

                    <div>
                        <label>Nội dung bài viết</label>
                        <Textarea
                            name="content"
                            value={blogPost.content}
                            onChange={handleInputChange}
                            color="blue"
                            error={!!errors.content}
                            rows={6}
                            className="bg-white"
                        />
                        {errors.content && (
                            <Typography variant="small" color="red" className="mt-1">
                                {errors.content}
                            </Typography>
                        )}
                    </div>

                    <div>
                        <label>Từ khóa (tags)</label>
                        <Input
                            name="tags"
                            value={blogPost.tags}
                            onChange={handleInputChange}
                            color="blue"
                            error={!!errors.tags}
                            icon={<TagIcon />}
                            className="bg-white"
                        />
                        {errors.tags && (
                            <Typography variant="small" color="red" className="mt-1">
                                {errors.tags}
                            </Typography>
                        )}
                    </div>

                    <div>
                        <label>upload ảnh nếu có</label>
                        <Input
                            name="image"
                            value={blogPost.image}
                            onChange={handleInputChange}
                            color="blue"
                            icon={<PhotoIcon />}
                            className="bg-white"
                            type={'file'}
                        />
                    </div>

                    <div className="flex space-x-4">
                        <Button
                            type="submit"
                            color="blue"
                            className="flex-grow transition-all hover:bg-blue-700 flex items-center justify-center"
                        >
                            <PencilIcon className="h-5 w-5 mr-2" />
                            {blogPost.blog_id ? 'Cập Nhật Bài Viết' : 'Đăng Bài Viết'}
                        </Button>
                        {blogPost.blog_id && (
                            <Button
                                color="red"
                                variant="outlined"
                                onClick={() => {
                                    setBlogToDelete(blogPost.blog_id);
                                    setDeleteDialogOpen(true);
                                }}
                                className="transition-all hover:bg-red-50 flex items-center"
                            >
                                <TrashIcon className="h-5 w-5 mr-2" />
                                Xóa
                            </Button>
                        )}
                    </div>

                    {submitStatus.success && (
                        <Alert color="green" className="mt-4">
                            {submitStatus.message}
                        </Alert>
                    )}

                    {submitStatus.error && (
                        <Alert color="red" className="mt-4">
                            {submitStatus.message}
                        </Alert>
                    )}
                </form>
            </Card>

            {/* Blog List */}
            <Card className="p-6 bg-gray-50 border-2 border-gray-100 overflow-auto max-h-[600px]">
                <div className="flex items-center mb-6">
                    <DocumentTextIcon className="h-8 w-8 text-blue-600 mr-3" />
                    <Typography variant="h4" color="blue-gray" className="font-bold">
                        Danh Sách Bài Viết
                    </Typography>
                </div>

                {blogs.length === 0 ? (
                    <Typography variant="paragraph" color="gray" className="text-center">
                        Chưa có bài viết nào
                    </Typography>
                ) : (
                    <div className="space-y-4">
                        {blogs.map((blog) => (
                            <div
                                key={blog.blog_id}
                                className="border p-4 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                                onClick={() => handleEditBlog(blog)}
                            >
                                <div className="flex justify-between items-center">
                                    <Typography variant="h6" color="blue-gray">
                                        {blog.title}
                                    </Typography>
                                    <Button
                                        size="sm"
                                        color="red"
                                        variant="text"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setBlogToDelete(blog.blog_id);
                                            setDeleteDialogOpen(true);
                                        }}
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </Button>
                                </div>
                                <Typography variant="small" color="gray" className="mt-2">
                                    {blog.tags}
                                </Typography>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                handler={() => setDeleteDialogOpen(!deleteDialogOpen)}
            >
                <DialogHeader>Xác Nhận Xóa Bài Viết</DialogHeader>
                <DialogBody>
                    Bạn có chắc chắn muốn xóa bài viết này không?
                    Hành động này không thể hoàn tác.
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="blue-gray"
                        onClick={() => setDeleteDialogOpen(false)}
                        className="mr-4"
                    >
                        Hủy
                    </Button>
                    <Button
                        color="red"
                        onClick={handleDeleteBlog}
                    >
                        Xác Nhận Xóa
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
}
