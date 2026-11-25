import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import dotenv from 'dotenv';
import 'express-async-errors';

dotenv.config();

import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import categoryRoutes from './routes/categories';
import cartRoutes from './routes/cart';
import wishlistRoutes from './routes/wishlist';
import orderRoutes from './routes/orders';
import adminRoutes from './routes/admin';
import uploadRoutes from './routes/upload';
import couponRoutes from './routes/coupons';
import bannerRoutes from './routes/banners';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      process.env.CLIENT_URL || 'http://localhost:3000',
      'http://localhost:3000',
      'http://localhost:3002',
      'http://172.16.11.243:3002',
    ];
    if (!origin || allowed.includes(origin)) callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/health', (req, res) => res.json({ status: 'ok', brand: 'Yel Aura' }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/banners', bannerRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Yel Aura backend running on port ${PORT}`);
});

export default app;
