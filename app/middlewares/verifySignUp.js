import db from "../models/index.js";
const { ROLES, user: User } = db;

export const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    const userByUsername = await User.findOne({ username: req.body.username });
    if (userByUsername) {
      return res.status(400).json({ message: "¡El nombre de usuario ya está en uso!" });
    }

    const userByEmail = await User.findOne({ email: req.body.email });
    if (userByEmail) {
      return res.status(400).json({ message: "¡El correo electrónico ya está en uso!" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        return res.status(400).json({ message: `¡El rol ${req.body.roles[i]} no existe!` });
      }
    }
  }
  next();
};