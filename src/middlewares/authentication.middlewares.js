const prisma = require("../configs/db.js");
const { logger } = require("../apps/logging.js");
const { decodeToken } = require("../utils/jsonwebtoken.js");

const authenticate = async (req, res, next) => {
  try {
    // 1. Ambil token dari header Authorization
    const authHeader = req.get("Authorization");

    // 2. Periksa apakah token ada dan formatnya valid
    if (!authHeader) {
      return unauthorizedResponse(res, "Authorization header missing");
    }

    const [scheme, extractedToken] = authHeader.split(" ");
    if (scheme !== "Bearer" || !extractedToken || extractedToken === "null") {
      return unauthorizedResponse(res, "Invalid Authorization format or token missing");
    }

    // 3. Decode token
    let claims;
    try {
      claims = decodeToken(extractedToken);
    } catch (error) {
      logger.warn("Invalid or expired token");
      return unauthorizedResponse(res, "Invalid or expired token");
    }

    if (!claims || !claims.uuid) {
      return unauthorizedResponse(res, "Invalid token claims");
    }

    // 4. Periksa apakah user ada di database
    const user = await prisma.user.findUnique({
      where: { id: claims.uuid },
      include: { token: true }, // Sesuaikan jika Anda membutuhkan relasi lain
    });

    if (!user) {
      logger.warn(`User with ID ${claims.uuid} not found`);
      return unauthorizedResponse(res, "User not found");
    }

    // 5. Periksa token di database (untuk validasi token session)
    const sessionToken = await prisma.token.findFirst({
      where: {
        token: extractedToken,
        user_id: claims.uuid,
      },
    });

    if (!sessionToken) {
      logger.warn("Session token not found or invalid");
      return unauthorizedResponse(res, "Session expired or invalid, please login again");
    }

    // 6. Tambahkan user dan session ke request
    req.user = user;
    req.sessionToken = sessionToken;

    logger.info(`User ${user.id} authenticated successfully`);
    next();
  } catch (error) {
    logger.error(`Authentication error: ${error.message}`, {
      stack: error.stack,
      path: req.originalUrl,
      method: req.method,
    });
    res.status(500).json({
      error: true,
      message: "An error occurred during authentication",
    });
  }
};

// Helper untuk mengirimkan unauthorized response
function unauthorizedResponse(res, message) {
  logger.warn(message);
  return res.status(401).json({
    error: true,
    message,
  });
}

module.exports = { authenticate };
