const logger = require('./winston-logger.js');


function errorLogger(error, req, res, next) { // for logging errors
  logger.log('error',error.stack) // log the error
  next(error) // forward to next middleware
}

function errorHandler(error, req, res, next){
  //if headers are sent like in a video stream, express handles error 
  if (res.headersSent) {
    return next(error)
  }
  // Sets HTTP status code
  res.status(error.status)

  // Sends response
  res.json({
    status: error.status,   //set error status
    message: error.message  //set error message
  })
}

module.exports = {
    errorLogger,
    errorHandler    
}