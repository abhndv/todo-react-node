var express = require("express");
var mongoose = require("mongoose");
var cookieParser = require("cookie-parser");
var createError = require("http-errors");
var cors = require("cors");
require("dotenv").config();

var todoRouter = require("./routes/todo");

var app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const port = process.env.PORT || 4000;
const dbURL = process.env.DBURL;

mongoose.connect(dbURL);
const mongodb = mongoose.connection;

mongodb.once("open", (_) => {
  console.log("Mongodb connected");
});

mongodb.on("error", (err) => {
  console.error("connection error:", err);
});

app.use("/", todoRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500).json({ message: err.message });
});

app.listen(port, function () {
  console.log(`Server up and running on port ${port}`);
});
