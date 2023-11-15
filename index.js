const express = require("express");
const { resolve } = require("path");
const mongoose = require("mongoose");
const auth = require("./routes/authRoute.js");
const task = require("./routes/taskRoute.js");
const cors = require("cors");
const app = express();

const corsOptions = {
  origin: "*", // Only allow requests from this origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Enable cookies and HTTP authentication
  optionsSuccessStatus: 204, // Respond to preflight requests with a 204 status
};

// Use CORS middleware with custom options
app.use(cors(corsOptions));
app.use(express.json());
const port = 3020;

const db = mongoose
  .connect(
    "mongodb+srv://trident:trident2023@cluster0.ngraetz.mongodb.net/?retryWrites=true&w=majority",
  )
  .then((res) => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log("helo");
    console.log(err);
  });

app.use("/auth", auth);
app.use("/task", task);

app.get("/", (req, res) => {
  res.send("health check");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
