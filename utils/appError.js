class AppError extends Error{
    constructor(message , statusCode){
        super(message)
        this.statusCode = statusCode
        if(statusCode/100 == 4)
            this.status = 'fail'
        else
            this.status = 'error'
        Error.captureStackTrace(this , this.constrctor)
    }
}

module.exports = AppError