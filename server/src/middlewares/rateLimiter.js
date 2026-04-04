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

export const redirectLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).render('404', { 
            message: "You're clicking too fast! Please slow down." 
        });
    }
});