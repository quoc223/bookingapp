const jwt = require('jsonwebtoken');
const {google} = require('googleapis');
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const authenticateAdminToken = (req, res, next) => {
  const token = req.cookies.token;
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    if (user.role !== 'admin') return res.sendStatus(403);
    req.user = user;
    next();
  });
};
const blogger = google.blogger({
  version: 'v3',
  auth: process.env.GOOGLE_API_KEY
});

const params = {
  blogId: '3213900'
};

// get the blog details
blogger.blogs.get(params, (err, res) => {
  if (err) {
    console.error(err);
    throw err;
  }
  console.log(`The blog url is ${res.data.url}`);
});
module.exports = { authenticateToken, authenticateAdminToken };