import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.middleware'
import { getAdminDashboard } from '../controllers/dashboard.controller'

const router = Router()

router.use(authenticate)
router.use(authorize('ADMIN'))

router.get('/', getAdminDashboard)

export default router
