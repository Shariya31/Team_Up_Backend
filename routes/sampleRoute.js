import express from 'express'
import { getSampleData } from '../controllers/sampleController.js'

const router = express.Router();

router.get('/example', getSampleData)

export default router