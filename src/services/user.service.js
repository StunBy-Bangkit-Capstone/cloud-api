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
      throw new ResponseError(400, "Account already exists");
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
    console.error("Error during user registration:", error);
    throw new ResponseError(500, "An unexpected error occurred during registration");
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
    console.error("Error during login:", error);
    throw new ResponseError(500, "An unexpected error occurred during login");
  }
};

// edit profile
const editUser = async (req, data) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
  });

  if (!user) {
    throw new ResponseError(404, "User Not Found");
  }

  // Encrypt password if being updated
  if (data.password) {
    data.password = await encryptPassword(data.password);
  }

  const updatedUser = await prisma.user.update({
    where: { id: req.user.id },
    data,
  });

  return updatedUser;

};

// get data user
const dataUser = async (req) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (!user) {
    throw new ResponseError(404, "User not found");
  }

  return {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    gender: user.gender,
    birth_day: user.birth_day,
    foto_url: user.foto_url,
  };

};

module.exports = { loginUser, registerUser, dataUser, editUser };
