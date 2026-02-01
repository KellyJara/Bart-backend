import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import { createRoles } from './libs/initialSetup.js';

import productRoutes from './routes/products.routes.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import cartRoutes from './routes/cart.routes.js';
import favoriteRoutes from './routes/favorite.routes.js'

const app = express();
app.use(cors());
createRoles();

app.use(express.json());

app.use(morgan('dev'));

app.use('/api/products',productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/favorite', favoriteRoutes);

export default app;