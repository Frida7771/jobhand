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
} from '../controllers/jobController';

import {
  validateJobInput,
  validateIdParam,
} from '../middleware/validationMiddleware';

import {
  checkForTestUser,
  authorizePermissions,
} from '../middleware/authMiddleware';

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

router.get(
  '/admin/all-jobs',
  authorizePermissions('admin'),
  getAllJobsForAdmin
);

export default router;
