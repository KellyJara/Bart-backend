import User from '../models/User.js';
import Role from '../models/Role.js';
import jwt from 'jsonwebtoken';
import config from '../config.js';

export const signUp = async (req, res) => {
  try {
    const { username, email, password, roles } = req.body;

    // 1️⃣ Crear el usuario y encriptar contraseña
    const newUser = new User({
      username,
      email,
      password: await User.encryptPassword(password),
    });

    // 2️⃣ Asignar roles
    if (roles && roles.length > 0) {
      const foundRoles = await Role.find({ name: { $in: roles } });
      newUser.roles = foundRoles.map(role => role._id);
    } else {
      const defaultRole = await Role.findOne({ name: 'user' });
      newUser.roles = [defaultRole._id];
    }

    // 3️⃣ Guardar usuario en DB
    const savedUser = await newUser.save();

    // 4️⃣ Generar token JWT
    const token = jwt.sign({ id: savedUser._id }, config.SECRET, { expiresIn: 86400 });

    // 5️⃣ Obtener nombres de roles
    const populatedRoles = await Role.find({ _id: { $in: savedUser.roles } });
    const roleNames = populatedRoles.map(role => role.name);

    // 6️⃣ Enviar respuesta consistente con signIn
    res.status(200).json({
      token,
      roles: roleNames,
      userId: savedUser._id.toString()
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user', error });
  }
};

export const signIn = async (req, res) => {
  try {
    const userFound = await User.findOne({ email: req.body.email }).populate("roles");
    if (!userFound) return res.status(400).json({ message: 'User not found' });

    const matchPassword = await User.comparePassword(req.body.password, userFound.password);
    if (!matchPassword) return res.status(401).json({ token: null, message: 'Invalid password' });

    const token = jwt.sign({ id: userFound._id }, config.SECRET, { expiresIn: 86400 });

    const roles = userFound.roles.map(role => role.name);
    const userId = userFound._id.toString();

    res.json({ token, roles, userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error signing in', error });
  }
};