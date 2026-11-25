import { Router } from 'express';
import { getDashboardStats, getAllOrders, getAllUsers, updateUserRole, getSalesAnalytics, getSettings, updateSettings } from '../controllers/admin.controller';
import { authenticate, isAdmin } from '../middleware/auth';

const router = Router();
router.use(authenticate, isAdmin);
router.get('/dashboard', getDashboardStats);
router.get('/orders', getAllOrders);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.get('/analytics/sales', getSalesAnalytics);
router.get('/settings', getSettings);
router.put('/settings', updateSettings);
export default router;
