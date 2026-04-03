import express from 'express'
import * as urlController from '../controller/url_controller.js'
import { urlLimiter } from '../middlewares/rateLimiter.js'

const router = express.Router()

router.post('/url', urlLimiter, urlController.createURLController)
router.get('/url/:short_url', urlLimiter, urlController.getURLController)
router.get('/:short_url', urlController.redirectController)
router.delete('/url/:short_url' , urlLimiter, urlController.deleteURLController)
router.get('/url/:short_url/expiry', urlLimiter, urlController.checkExpiryController)
router.get('/url/:short_url/qr', urlLimiter, urlController.getQRCodeController)

export default router