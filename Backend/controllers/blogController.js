const pool = require("../config/connectdatabase");


exports.createBlogPost = async (req, res) => {
    try {
        const  doctor_id  = req.user?.doctorId; // Extract doctor_id from verified token
        const {
            title,
            content,
            tags,
            image
        } = req.body;

        await pool.query('CALL SP_CREATE_BLOG_POST(?, ?, ?, ?,?)', [
            doctor_id,
            title,
            content,
            tags,
            image
        ]);

        res.status(200).json({ message: 'Blog post created successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
// UC5.2: Get Blog Posts
// Lấy danh sách blog theo doctor_id
exports.getBlogsByDoctorID = async (req, res) => {
    try {
        const doctor_id = req.user?.doctorId; // Giả sử token chứa doctorId
        const [rows] = await pool.query('CALL GetBlogsByDoctorID(?)', [doctor_id]);

        res.status(200).json({ blogs: rows[0] }); // Trả về danh sách blogs
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
// Lấy danh sách 5 blog mới nhất
// Lấy danh sách 5 blog mới nhất
exports.getBlogs = async (req, res) => {
    try {
        const [rows] = await pool.query('CALL GetBlogs()');
        console.log(rows); // Debug the structure of rows
        const blogs = Array.isArray(rows) ? rows[0] : []; // Safely handle the response structure
        res.status(200).json({ blogs }); // Return the blogs array
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Cập nhật blog theo ID
exports.updateBlogByID = async (req, res) => {
    try {
        const { blog_id, title, content, publish_date, tags,image } = req.body;

        await pool.query('CALL UpdateBlogsByID(?, ?, ?, ?, ?)', [
            blog_id,
            title,
            content,
            publish_date,
            tags,
            image
        ]);

        res.status(200).json({ message: 'Blog updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
// Xóa blog theo ID
exports.deleteBlogByID = async (req, res) => {
    try {
        const { blog_id } = req.params; // Lấy blog_id từ tham số URL

        await pool.query('CALL DeleteBlogsByID(?)', [blog_id]);

        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

