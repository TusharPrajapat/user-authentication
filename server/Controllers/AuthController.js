const User = require("../Models/UserModel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");

module.exports.Signup = async (req, res, next) => {
  try {
    const { email, password, username, createdAt } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({ message: "User already exists" });
    }

    const user = await User.create({ email, password, username, createdAt });
    const token = createSecretToken(user._id);

    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res
      .status(201)
      .json({ message: "User signed in successfully", success: true, user });
    next();
  } catch (error) {
    console.error(error);
  }
};

module.exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //1. Check required fields
    if (!email || !password) {
      return res.json({ message: "All fields are required" });
    }

    //2. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "Incorrect password or email" });
    }

    //3. Check password
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.json({ message: "Incorrect password or email" });
    }

    //4. Create token
    const token = createSecretToken(user._id);

    //5. Set token inside cookie
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });

    //6. Send response
    res.status(201).json({
      message: "User logged in successfully",
      success: true,
    });
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error, please try again" });
  }
};
