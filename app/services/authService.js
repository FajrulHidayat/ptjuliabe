const jwt = require("jsonwebtoken");
// const jwtBlacklist = require("jwt-blacklist")(jwt);

const secret =
  process.env.NODE_ENV === "production" ? process.env.SECRET_BASE : "secret";

const authService = () => {
  const issue = payload => jwt.sign(payload, secret, { expiresIn: 10800 });
  const verify = (token, cb) => jwt.verify(token, secret, {}, cb);
  // const blacklist = token => jwtBlacklist.blacklist(token);

  return {
    issue,
    verify,
    // blacklist
  };
};

module.exports = authService;
