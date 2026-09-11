import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.middleware'
import * as ctrl from '../controllers/member.controller'

const router = Router()

router.use(authenticate)
router.use(authorize('ADMIN'))

router.get('/', ctrl.getAllMembers)
router.get('/:id', ctrl.getMember)
router.patch('/:id', ctrl.updateMember)
router.patch('/:id/approve', ctrl.approveMember)
router.patch('/:id/suspend', ctrl.suspendMember)
router.delete('/:id', ctrl.deleteMember)

export default router
