const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express(); //Creating express server

require("dotenv").config();
const cookieParser = require("cookie-parser");
const authRoute = require("./Routes/AuthRoute");
const { MONGO_URL, PORT } = process.env;

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Connected To DB!");
  })
  .catch((err) => {
    console.log("Server is NOT CONNECTED TO DB!", err);
  });

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use("/", authRoute);
