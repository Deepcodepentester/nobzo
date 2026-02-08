// middleware/optionalAuth.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.cookies.accessToken
    if (!token) return next();

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        console.log(user)
        req.user = user
        next()
      })

  
};
