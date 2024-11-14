const bcrypt = require("bcrypt");

async function checkPassword(requestPassword, userPassword) {
    return await bcrypt.compare(requestPassword, userPassword);
}

async function encryptPassword(password) {
    return await bcrypt.hash(password, 10);
}

module.exports = { checkPassword, encryptPassword };