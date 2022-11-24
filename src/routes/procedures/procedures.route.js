import { Router } from 'express'
import * as procedures from '../../controllers/procedures/procedures.controller.js';

const router = Router()

router.get('/paginated', procedures.getAllPaginated)
router.get('/:id/procedures-availability', procedures.getAllProceduresAvailability)
router.get('/', procedures.getAll)
router.get('/:id', procedures.getOne)
router.post('/', procedures.create)
router.put('/:id', procedures.update)
router.delete('/:id', procedures.remove)

export default router
