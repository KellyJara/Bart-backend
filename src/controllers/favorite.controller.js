import User from '../models/User.js';

export const toggleFavorite = async (req, res) => {
  const { productId } = req.body;
  const userId = req.userId;

  const user = await User.findById(userId);

  const exists = user.favorites.includes(productId);

  if (exists) {
    user.favorites.pull(productId);
  } else {
    user.favorites.push(productId);
  }

  await user.save();
  res.json(user.favorites);
};
