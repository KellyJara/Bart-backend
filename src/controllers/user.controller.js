import User from '../models/User.js';
import Product from '../models/Product.js';

/**
 * Crear usuario
 */
export const createUser = async (req, res) => {
  try {
    const { username, email, password, profileImg, aboutMe } = req.body;

    const newUser = new User({
      username,
      email,
      password: await User.encryptPassword(password),
      profileImg,
      aboutMe,
    });

    await newUser.save();

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        profileImg: newUser.profileImg,
      },
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    res.status(500).json({ message: 'Error creating user', error });
  }
};

/**
 * Obtener perfil de usuario (con token)
 * Incluye:
 *  - carrito poblado
 *  - favoritos poblados
 *  - productos propios
 */
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId; // viene del token

    // Buscar usuario
    const user = await User.findById(userId)
      .select('-password')
      .populate('roles', 'name')
      .populate('cart.product')
      .populate('favorites');

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Productos que posee
    const products = await Product.find({ owner: user._id });

    res.json({
      user,
      cart: user.cart,
      favorites: user.favorites,
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user profile', error });
  }
};

/**
 * Obtener todos los usuarios
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .populate('roles', 'name')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

/**
 * Actualizar usuario
 */
export const updateUser = async (req, res) => {
  try {
    const userId = req.userId; // actualizar el usuario logueado
    const { username, email, profileImg, aboutMe, password } = req.body;

    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (profileImg) updateData.profileImg = profileImg;
    if (aboutMe !== undefined) updateData.aboutMe = aboutMe;
    if (password) updateData.password = await User.encryptPassword(password);

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    })
      .select('-password')
      .populate('roles', 'name');

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    res.status(500).json({ message: 'Error updating user', error });
  }
};
