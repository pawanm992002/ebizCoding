const express = require("express");
const router = express.Router();
const { User } = require("../models/userModel");
const jwt = require("jsonwebtoken");

const secret_key = process.env.REACT_APP_SECRET_KEY;

const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(400).send("Access Denied");

  try {
    const verified = jwt.verify(token.split(" ")[1], secret_key);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
};

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("Please Enter all Required Fields");
    }

    const userExists = await User.findOne({ email, password });
    if (!userExists) throw new Error("User Not Exists");

    const token = jwt.sign(
      {
        email,
        password,
      },
      secret_key
    );

    res.status(200).json({
      user: userExists,
      token: token,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { fname, lname, email, gender, dob, password } = req.body;

    if (!fname || !lname || !email || !password) {
      throw new Error("Please Enter all Required Fields");
    }

    const userExists = await User.findOne({ email });
    if (userExists) throw new Error("User Already Exists");

    const user = await User({ fname, lname, email, gender, dob, password });
    await user.save();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/change-password", authenticateJWT, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { email, password } = req.user;
    console.log(email, password, oldPassword, newPassword);

    if (password !== oldPassword) throw new Error("Password not matching");

    const result = await User.findOneAndUpdate(
      {
        email: req.user.email,
      },
      {
        $set: { password: newPassword },
      }
    );
    if (result) {
      res.status(200).json("Password changed succussfully");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/update-profile", authenticateJWT, async (req, res) => {
  try {
    const { fname, lname, gender, dob } = req.body;

    const result = await User.findOneAndUpdate(
      {
        email: req.user.email,
      },
      {
        fname,
        lname,
        gender,
        dob,
      }
    );
    if (result) {
      res.status(200).json("Profile Updated succussfully");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
