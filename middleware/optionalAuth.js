// middleware/optionalAuth.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const {
        status,
      } = req.query;
    //filtering by status is for authenticated users. If status is included in query parameters return 403
    const token = req.cookies.accessToken
    if (status) return res.sendStatus(403)
    if (!token) return next();

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        console.log(user)
        req.user = user
        next()
      })

  
};
