import { Router } from 'express';
import { getWishlist, toggleWishlist, removeFromWishlist } from '../controllers/wishlist.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
router.use(authenticate);
router.get('/', getWishlist);
router.post('/toggle', toggleWishlist);
router.delete('/:productId', removeFromWishlist);
export default router;
