import { Router } from 'express';
import {
  getApplicationStats,
  getCurrentUser,
  updateUser,
  getAllUsersForAdmin, 
} from '../controllers/userController.js';
import { validateUpdateUserInput } from '../middleware/validationMiddleware.js';
import {
  authorizePermissions,
  checkForTestUser,
} from '../middleware/authMiddleware.js';
import upload from '../middleware/multerMiddleware.js';
const router = Router();

router.get('/current-user', getCurrentUser);
router.get('/admin/app-stats', [
  authorizePermissions('admin'),
  getApplicationStats,
]);
router.patch(
  '/update-user',
  checkForTestUser,
  upload.single('avatar'),
  validateUpdateUserInput,
  updateUser
);
router.get('/admin/all-users', [
  authorizePermissions('admin'),
  getAllUsersForAdmin,
]);

export default router;