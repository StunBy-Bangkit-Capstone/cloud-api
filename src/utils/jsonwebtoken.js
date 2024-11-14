const jwt = require("jsonwebtoken");

function generateToken(idUser, idSession, role) {
    return jwt.sign(
        {
            uuid: idUser,
            id_session: idSession,
            role: role,
        },
        process.env.SECRET_KEY,
        { algorithm: "HS512", expiresIn: "24h" }
    );
}

function decodeToken(token) {
    return jwt.verify(token, process.env.SECRET_KEY, {
        algorithms: ["HS512"],
    });
}

module.exports = {
    generateToken,
    decodeToken,
};
