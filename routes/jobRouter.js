import { Router } from 'express';
const router = Router();
import {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  showStats,
  getAllJobsForAdmin, 
} from '../controllers/jobController.js';
import {
  validateJobInput,
  validateIdParam,
} from '../middleware/validationMiddleware.js';
import { 
  checkForTestUser,
  authorizePermissions, 
} from '../middleware/authMiddleware.js';

// router.get('/',getAllJobs)
// router.post('/',createJob)

router
  .route('/')
  .get(getAllJobs)
  .post(checkForTestUser, validateJobInput, createJob);

router.route('/stats').get(showStats);

router
  .route('/:id')
  .get(validateIdParam, getJob)
  .patch(checkForTestUser, validateJobInput, validateIdParam, updateJob)
  .delete(checkForTestUser, validateIdParam, deleteJob);

router.get('/admin/all-jobs', [
  authorizePermissions('admin'),
  getAllJobsForAdmin,
]);

export default router;