const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
mongoose
    .connect("mongodb://127.0.0.1:27017/cardify")
    .then(console.log("Connected to DataBase"))
    .catch((err) => console.log(err));
