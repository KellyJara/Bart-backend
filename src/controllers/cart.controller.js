import User from '../models/User.js';

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.userId; // viene del token

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Buscar si ya está en el carrito
    const item = user.cart.find(i => i.product.toString() === productId);

    if (item) {
      item.quantity += 1;
    } else {
      user.cart.push({ product: productId, quantity: 1 });
    }

    await user.save();

    // Devolver carrito poblado con info de productos
    const populatedUser = await user.populate('cart.product');
    res.status(200).json(populatedUser.cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding to cart' });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.userId; // viene del token

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { cart: { product: productId } } },
      { new: true }
    ).populate('cart.product');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user.cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error removing from cart' });
  }
};
