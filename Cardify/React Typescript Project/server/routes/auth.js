const { Router } = require("express");
const passport = require("passport");
const User = require("../database/schemas/user");
const { hashPassword, comparePass } = require("../hashPass");
const router = Router();

function isEmail(email) {
    if (!/^[a-zA-Z0-9.+_~@-]+$/.test(email)) return false;
    if (email.search("@") == 0 || email.search("@") == email.length - 1) return false;
    if (email.slice(email.search("@")).search(/\./) == -1 || email.slice(email.search("@")).search(/\./) == 1 || email.slice(email.search("@")).search(/\./) == email.slice(email.search("@")).length - 1) return false;
    return true;
}

router.post("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) console.log(err);
    });
    console.log("logged out");
    res.sendStatus(200);
});

router.post(
    "/login",
    async (req, res, next) => {
        if (req.user) return res.sendStatus(401);
        if (!req.body.email) return res.json({ msg: "enter your email", field: "email", error: true });
        if (!isEmail(req.body.email)) return res.json({ msg: "enter an email", field: "email", error: true });
        let userFromDB;
        userFromDB = await User.findOne({ email: req.body.email });
        if (!userFromDB) return res.json({ msg: "there is no user with this email", field: "email", error: true });

        if (!req.body.password) return res.json({ msg: "enter your password", field: "password", error: true });

        const isCorrectPassword = comparePass(req.body.password, userFromDB.password);
        if (!isCorrectPassword) return res.json({ msg: "wrong password, please try again", field: "password", error: true });
        next();
    },
    passport.authenticate("local"),
    (req, res) => {
        res.send(req.user);
    }
);

router.get("/user", (req, res) => {
    // console.log(req)
    res.send(req.user);
});

function validUsername(username) {
    if (username.length < 3 || username.length > 20) return false;
    if (isEmail(username)) return false;
    if (username.search(" ") == 0 || username.search(" ") == username.length - 1) return false;
    if (username.search("  ") != -1) return false;
    return true;
}

function validPassword(password) {
    if (password.length > 24 || password.length < 8) return false;
    return true;
}

router.post(
    "/register",
    async (req, res, next) => {
        if (req.user) return res.sendStatus(401);
        const { name, email, business } = req.body;
        if (!email) return res.json({ msg: "enter an email", field: "email", error: true });
        const useremailDB = await User.findOne({ email: email });
        if (useremailDB) return res.json({ msg: "this email is already associate with a user", field: "email", error: true });

        if (!isEmail(email)) return res.json({ msg: "enter a valid email", field: "email", error: true });

        if (!name) return res.json({ msg: "enter a name", field: "name", error: true });

        if (!validUsername(name)) return res.json({ msg: "name cannot be an email, and must contain 3-20 characters without two spaces in a row, and without space at the start or the end", field: "username", error: true });

        if (!req.body.password) return res.json({ msg: "enter a password", field: "password", error: true });
        if (!validPassword(req.body.password)) return res.json({ msg: "password must contain 8-24 characters", field: "password", error: true });

        let usersCount = await User.countDocuments();
        const hashedPass = hashPassword(req.body.password);
        await User.create({
            userid: usersCount + 1,
            name: name,
            password: hashedPass,
            email: email,
            business: business,
        });

        console.log("user created");
        next();
    },
    passport.authenticate("local"),
    (req, res) => {
        res.send(req.user);
    }
);

module.exports = router;
