import jwt from "jsonwebtoken";
import config from "../config.js";
import User from "../models/User.js";
import Role from "../models/Role.js";

export const verifyToken = async (req, res, next) => {
  try {
    
    console.log('Headers recibidos:', req.headers);


    const token = req.headers["x-access-token"];
    console.log('Token recibido:', token);

    if (!token) return res.status(403).json({ message: "No token provided" });

    let decoded;
    try {
      decoded = jwt.verify(token, config.SECRET);
      console.log('Token decodificado:', decoded);
    } catch (err) {
      console.log('Error al verificar token:', err.message);
      return res.status(401).json({ message: "Unauthorized!" });
    }

    req.userId = decoded.id;

    const user = await User.findById(req.userId, { password: 0 });
    console.log('Usuario encontrado:', user);

    if (!user) return res.status(404).json({ message: "No user found" });

    next();
  } catch (error) {
    console.log('Error en verifyToken middleware:', error);
    return res.status(401).json({ message: "Unauthorized!" });
  }
};

export const isAdmin = async (req, res, next) => {
    const user = await User.findById(req.userId)
   const roles = await Role.find({_id: {$in: user.roles}})
    console.log(roles);
    
    for (let i = 0; i < roles.length; i++) {
        if(roles[i].name === "admin"){
            next();
            return;
            }
            
        }
    return res.status(403).json({message: "Require Admin Role!"});
};

export const isModerator = async (req, res, next) => {
   const user = await User.findById(req.userId)
   const roles = await Role.find({_id: {$in: user.roles}})
    console.log(roles);
    
    for (let i = 0; i < roles.length; i++) {
        if(roles[i].name === "moderator"){
            next();
            return;
            }
            
        }
    return res.status(403).json({message: "Require Moderator Role!"});
}
    

