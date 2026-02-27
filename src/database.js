import mongoose from 'mongoose';

const URI = process.env.MONGODB_URI;

if (!URI) {
  throw new Error('❌ MONGODB_URI no está definida');
}

mongoose.connect(URI)
  .then(() => console.log('✅ MongoDB Atlas connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));