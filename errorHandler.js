// errorHandler.js
module.exports = (err, req, res, next) => {
    const statusCode = err.statusCode || 500
    console.log(statusCode)
  
    res.status(statusCode).json({
      success: false,
      message: err.message || 'Internal Server Error',
    })
  }
  