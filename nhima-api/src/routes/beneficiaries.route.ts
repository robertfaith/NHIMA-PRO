import { Router }                  from 'express'
import { authenticate, authorize } from '../middleware/auth.middleware'
import * as ctrl                   from '../controllers/beneficiaries.controller'

const router = Router()

// All routes require a valid token + ADMIN role
router.use(authenticate)
router.use(authorize('ADMIN'))

router.get   ('/',            ctrl.getAllBeneficiaries)  // GET    /api/admin/beneficiaries
router.get   ('/:id',         ctrl.getBeneficiary)       // GET    /api/admin/beneficiaries/:id
router.patch ('/:id',         ctrl.updateBeneficiary)    // PATCH  /api/admin/beneficiaries/:id
router.patch ('/:id/approve', ctrl.approveBeneficiary)   // PATCH  /api/admin/beneficiaries/:id/approve
router.delete('/:id',         ctrl.deleteBeneficiary)    // DELETE /api/admin/beneficiaries/:id

export default router