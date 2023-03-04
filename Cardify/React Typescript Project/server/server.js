//======== [Server Init] =======================
const express = require("express");
const cors = require("cors");
const cookies = require("cookie-parser");
const sessions = require("express-session");
const MongoStore = require("connect-mongo");
const authRoute = require("./routes/auth");
const cardsRoute = require("./routes/cards");
const upload = require("express-fileupload");

require("./database/db");

const passport = require("passport");
require("./strategies/local");

const app = express();

app.listen("3001");

//========= [Middleware Functions] ===================
app.use(cookies());
app.use(
  sessions({
    secret: "adDSFAdfafadvTJyUKjrhtrjtrjtha",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: "mongodb://127.0.0.1:27017/cardify",
    }),
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(upload());
app.use("/static", express.static(__dirname + "/images"));

app.use("/api/auth", authRoute);
app.use("/api/cards", cardsRoute);
// ========= [Routes] ============================
// app.post("/", (req, res) => {
//   console.log(req.body);
//   res.sendStatus(201);
// });
