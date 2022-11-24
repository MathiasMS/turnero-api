import { Router } from 'express'
import * as authentication from '../../controllers/authentication/authentication.controller.js';

const router = Router()

router.post('/signup', authentication.signUpUser)
router.post('/login', authentication.login)

export default router
