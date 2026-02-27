import User from '../models/User.js';

export const getFavorites = async (req, res) => {
  try {
    const userId = req.query.userId; // el ID siempre debe venir desde el frontend

    if (!userId) {
      return res.status(400).json({ message: 'User ID must be provided' });
    }

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user.favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching favorites' });
  }
};

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
