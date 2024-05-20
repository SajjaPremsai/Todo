const winston = require("winston")
const { timestamp , json , combine , prettyPrint } = winston.format

const logger = new winston.createLogger({
    level:"warn",
    format: combine(
        timestamp(),
        json(),
        prettyPrint()
    ),
    transports:[
        new winston.transports.Console(),
        new winston.transports.File({filename:"./error.log",level:"error"}),
        new winston.transports.File({filename:"./combined.log"})
    ]
})

module.exports = logger;