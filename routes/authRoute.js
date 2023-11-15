const express = require("express");
const { login, signup, getUserDetails } = require("../controllers/AuthController.js");

const auth = express.Router();

auth.post("/signup", signup);
auth.post("/login", login);
auth.get("/",getUserDetails);

module.exports = auth;
