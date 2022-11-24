import { Router } from 'express'
import * as categories from '../../controllers/categories/categories.controller.js';

const router = Router()

router.get('/', categories.getAll)
router.get('/:id', categories.getOne)
router.post('/', categories.create)
router.put('/:id', categories.update)
router.delete('/:id', categories.remove)

export default router
