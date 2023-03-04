const passport = require("passport");
const { Strategy } = require("passport-local");
const User = require("../database/schemas/user");
const { comparePass } = require("../hashPass");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  user.password = undefined;
  return done(null, user);
});

passport.use(
  new Strategy({ usernameField: "email" }, async (email, password, done) => {
    const userFromDB = await User.findOne({ email: email });
    done(null, userFromDB);
  })
);
