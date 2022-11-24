import { Router } from 'express'
import * as proceduresAvailability from '../../controllers/procedures-availability/procedures-availability.controller.js';

const router = Router()

router.post('/confirm', proceduresAvailability.confirmAppointment)
router.post('/cancel', proceduresAvailability.cancelAppointment)

export default router
