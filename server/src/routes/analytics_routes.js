import express from 'express'
import * as analyticsController from '../controller/analytics_controller.js'

const router = express.Router()
router.get('/:short_url', analyticsController.getAnalyticsController);

export default router