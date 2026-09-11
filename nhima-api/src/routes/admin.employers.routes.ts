import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.middleware'
import * as ctrl from '../controllers/employer.controller'

const router = Router()

router.use(authenticate)
router.use(authorize('ADMIN'))

router.get('/', ctrl.getAllEmployers)
router.get('/:id', ctrl.getEmployer)
router.patch('/:id', ctrl.updateEmployer)
router.patch('/:id/approve', ctrl.approveEmployer)
router.patch('/:id/suspend', ctrl.suspendEmployer)
router.patch('/:id/compliance', ctrl.setCompliance)
router.delete('/:id', ctrl.deleteEmployer)

export default router
