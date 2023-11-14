const express = require("express");
const { login, signup } = require("../controllers/AuthController.js");

const auth = express.Router();

auth.post("/signup", signup);
auth.post("/login", login);

module.exports = auth;
