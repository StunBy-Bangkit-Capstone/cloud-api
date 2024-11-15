const prisma = require("../configs/db.js");
const { encryptPassword, checkPassword } = require("../utils/bcrypt.js");
const { ResponseError } = require("../errors/response-error.js");
const { generateToken } = require("../utils/jsonwebtoken");

// register
const registerUser = async (data) => {

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
      birth_day: data.birth_day.toISOString(),
      password: hashedPassword,
    },
  });

  return user;
};

const loginUser = async (data) => {

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

  return {
    token,
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    foto_url: user.foto_url,
    gender: user.gender,
    birth_day: user.birth_day,
  };
};

module.exports = { loginUser, registerUser };
