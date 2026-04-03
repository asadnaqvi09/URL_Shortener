import rateLimit from 'express-rate-limit'

export const urlLimiter = rateLimit({
    windowMs : 5 * 60 * 1000,
    max : 10,
    standardHeaders : true,
    legacyHeaders : false,
    message : {
        success : false,
        message : "Too many requests.Please try again later"
    }
});