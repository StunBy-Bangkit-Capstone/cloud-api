const jwt = require("jsonwebtoken");
const { ResponseError } = require("../errors/response-error.js");

function generateToken(idUser) {
  if (!process.env.SECRET_KEY) {
    throw new Error("SECRET_KEY is not defined in environment variables");
  }

  return jwt.sign(
    {
      uuid: idUser,
    },
    process.env.SECRET_KEY,
    { algorithm: "HS512", expiresIn: "24h" }
  );
}

async function decodeToken(token) {
  if (!process.env.SECRET_KEY) {
    throw new Error("SECRET_KEY is not defined in environment variables");
  }

  try {
    return await jwt.verify(token, process.env.SECRET_KEY, {
      algorithms: ["HS512"],
    });
  } catch (error) {
    throw new ResponseError(401, "Invalid or expired token", {
      token: error.message,
    });
  }
}

module.exports = {
  generateToken,
  decodeToken,
};
