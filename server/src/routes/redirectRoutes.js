import express from 'express'
import { redirectLimiter } from '../middlewares/rateLimiter.js';
import { handleRedirect } from '../controller/redirect_controller.js'

const router = express.Router()

router.get('/:short_url', redirectLimiter , handleRedirect);

export default router