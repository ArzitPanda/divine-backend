const User = require("../models/User.js");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      email: email,
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    const JWT_SECRET = "your-secret-key";
    const token = jwt.sign(
      { username: user.username, _id: user._id },
      JWT_SECRET,
    );

    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { login, signup };
