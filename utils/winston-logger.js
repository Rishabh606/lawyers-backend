const {createLogger,transports, format} = require('winston');
const { combine, timestamp, label, prettyPrint, splat, simple, colorize, errors } = format;

const  loggingLevel = process.env.DEBUG_LEVEL||'debug'; //setting logging level

//set logging configuration 
let options = {
  console: {
    level: loggingLevel,        // set logging level
    handleExceptions: true,     // handle exceptions 
    json: false,                // log in json format set to false
    colorize: true,             // make it colorise
  }
};
//create logger
const logger = createLogger({
    format: combine(
        label({label:'LOG'}),       // add label to logs
        errors({ stack: true }),    // print stack trace
        colorize(),                 // color the logs
//      timestamp(),
        prettyPrint(),              
        splat(),                    //string interpolation
        simple()                    //simple string
    ),
    //create transport: console, file where logs are stored
    transports: [
        new transports.Console(options.console)
    ],

    exitOnError: false, // do not exit on handled exceptions
});

logger.stream = {
  write: function(message, encoding) {
    logger.info(message);
  },
};
module.exports = logger;