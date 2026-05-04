import jwt from "jsonwebtoken";
import db from "../models/index.js";
import authConfig from "../config/auth.config.js";

const { user: User, role: Role } = db;

export const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"] || req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "¡No se proporcionó un token!" });
  }

  jwt.verify(token.replace("Bearer ", ""), authConfig.secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "¡No autorizado!" });
    }
    req.userId = decoded.id;
    next();
  });
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate("roles");
    const adminRole = user.roles.find(role => role.name === "admin");

    if (adminRole) {
      next();
      return;
    }
    res.status(403).json({ message: "¡Se requiere el rol de administrador!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const isModerator = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate("roles");
    const modRole = user.roles.find((role) => role.name === "moderator");

    if (modRole) {
      next();
      return;
    }
    res.status(403).json({ message: "¡Se requiere el rol de moderador!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const isModeratorOrAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate("roles");
    const hasRole = user.roles.some((role) => ["admin", "moderator"].includes(role.name));

    if (hasRole) {
      next();
      return;
    }
    res.status(403).json({ message: "¡Se requiere el rol de moderador o administrador!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};