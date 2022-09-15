const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message;

  // Console for dev
  // console.log(err.stack.red);
  // console.log({ errName: err.name });
  // console.log(err);

  // Mongoos bad ObjectId
  if(err.name === 'CastError') {
    const message = `Incorrect Resource ID. Resource not found with the id of ${err.value}`
    // const message = `Bootcamp not found with the id of ${req.params.id}`
    error = new ErrorResponse(message, 404)
  }
  // Mongoose duplicate key error
  if(err.code === 11000) {
    const message = `Duplicate field value was entered. ${Object.keys(err.keyValue)}: "${Object.values(err.keyValue)}" already exists.`
    error = new ErrorResponse(message, 400) // bad request
  }
  
  
  // Mongoose validation error
  if(err.name === 'ValidationError') {
    console.log('message: ', Object.values(err.errors)[0].message);
    const message = Object.values(err.errors).map(val => val.message);
    
    error = new ErrorResponse(message, 400);
  };

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });

  next();
};

module.exports = errorHandler;