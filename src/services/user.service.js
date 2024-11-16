const prisma = require("../configs/db.js");
const { encryptPassword, checkPassword } = require("../utils/bcrypt.js");
const { ResponseError } = require("../errors/response-error.js");
const { generateToken } = require("../utils/jsonwebtoken");

// register
const registerUser = async (data) => {
  try {
    const isUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (isUser) {
      throw new ResponseError(400, "account already created");
    }
    const hashedPassword = await encryptPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        full_name: data.full_name,
        gender: data.gender,
        birth_day: data.birth_day,
        password: hashedPassword,
      },
    });

    return user;
  } catch (error) {
    throw new ResponseError(500, error, true);
  }
};

// login
const loginUser = async (data) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!user) {
      throw new ResponseError(401, "Invalid email or password");
    }

    const isPasswordValid = await checkPassword(data.password, user.password);

    if (!isPasswordValid) {
      throw new ResponseError(401, "Invalid email or password");
    }

    const token = generateToken(user.id);

    await prisma.token.create({
      data: {
        user_id: user.id,
        token,
      },
    });

    return token;
  } catch (error) {
    throw new ResponseError(500, error, true);
  }
};

// edit profile

const editUser = async (req, data) => {
  try {
    const user = prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    if (!user) {
      throw new ResponseError(400, "User Not Found", true);
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data,
    });

    return updatedUser;
  } catch (error) {
    throw new ResponseError(500, error, true);
  }
};

// get data user
const dataUser = async (req) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      throw new ResponseError(400, "User not found", true);
    }

    return {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      gender: user.gender,
      birth_day: user.birth_day,
      foto_url: user.foto_url,
    };
  } catch (error) {
    throw new ResponseError(500, error, true);
  }
};

module.exports = { loginUser, registerUser, dataUser, editUser };
