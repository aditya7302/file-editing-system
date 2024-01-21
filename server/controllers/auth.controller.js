const { UserModel } = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userSignin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(403).send({ message: "Provide proper data for signin" });
  }

  try {
    const matchedUser = await UserModel.findOne({ email });

    if (!matchedUser) {
      return res.status(404).send({ message: "User not found!" });
    }

    bcrypt.compare(password, matchedUser._doc.password, function (err, result) {
      if (err) {
        return res
          .status(400)
          .send({ message: "Error in decryption", error: err });
      }

      if (!result) {
        return res.status(400).send({ message: "Wrong Password!" });
      }

      const token = jwt.sign(
        {
          userId: matchedUser._doc._id,
        },
        process.env.SECRET_KEY,
        { expiresIn: "7d" }
      );

      const { password, ...userCred } = matchedUser._doc;

      res
        .status(200)
        .send({ message: "Login successful", user: { userCred, token } });
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).send({
      message: "Internal server error!",
      error: error.message,
    });
  }
};

const userSignUp = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(403).send({ message: "Provide proper data for signup" });
  }

  try {
    const matchedUsers = await UserModel.find({ email });

    if (matchedUsers.length) {
      return res.status(200).send({ message: "User already exists!" });
    }

    bcrypt.hash(password, +process.env.SALT_ROUND, async function (err, hash) {
      if (err) {
        return res.status(500).send({ message: "Error in bcrypt" });
      }

      try {

        const user = new UserModel({ username, email, password: hash });
        await user.save();


        res.status(201).send({
          message: "Signup successful",
        });
      } catch (error) {
        console.log("error:", error);
        res.status(400).send({
          message: error.message,
          error: error,
        });
      }
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).send({
      message: "Internal server error!",
      error: error,
    });
  }
};

module.exports = { userSignin, userSignUp };
