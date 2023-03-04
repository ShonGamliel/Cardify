const bcrypt = require("bcryptjs");

function hashPassword(password) {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(password, salt);
}

function comparePass(raw, hash){
  return bcrypt.compareSync(raw,hash)
}

module.exports = {
    hashPassword,
    comparePass,
};