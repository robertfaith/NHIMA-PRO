import { Router }                  from 'express'
import { authenticate, authorize } from '../middleware/auth.middleware'
import * as ctrl                   from '../controllers/claim.controller'

const router = Router()

router.use(authenticate)
router.use(authorize('ADMIN'))

router.get  ('/',            ctrl.getAllClaims)   // GET   /api/admin/claims
router.get  ('/:id',         ctrl.getClaim)       // GET   /api/admin/claims/:id
router.patch('/:id/approve', ctrl.approveClaim)   // PATCH /api/admin/claims/:id/approve
router.patch('/:id/reject',  ctrl.rejectClaim)    // PATCH /api/admin/claims/:id/reject

export default router