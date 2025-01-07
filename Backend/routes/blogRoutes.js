const express = require('express');
const {isDoctor} = require("../midelware/auth");
const blogController = require("../controllers/blogController");
const router = express.Router();

router.post('/blog', isDoctor, blogController.createBlogPost);
router.get('/blogs', blogController.getBlogs);
router.get('/blogsbydoctor',isDoctor, blogController.getBlogsByDoctorID);
router.put('/blogs/:blog_id', isDoctor, blogController.updateBlogByID);


module.exports = router;
