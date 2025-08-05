import { Router } from 'express';
import { 
  getAllJobs, 
  createJob, 
  getJob, 
  updateJob, 
  deleteJob, 
  showStats 
} from '../controllers/jobController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = Router();

router.route('/').post(authenticateUser, createJob).get(authenticateUser, getAllJobs);
router.route('/stats').get(authenticateUser, showStats);
router.route('/:id').get(authenticateUser, getJob).delete(authenticateUser, deleteJob).patch(authenticateUser, updateJob);

export default router; 