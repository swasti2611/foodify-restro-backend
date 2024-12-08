const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/authUser");

// User sign-in logic
let signIn = async (req, res) => {
  try {
    const { name, lastName, email, password, confirmPassword } = req.body;

    // Check if all required fields are provided
    if (!name || !lastName || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Check if user already exists
    let isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create new user
    let user = await User.create({
      name,
      lastName,
      email,
      password: hashPassword,
    });

    // Respond with success message
    res.status(201).json({
      message: "User created successfully",
      user: { name: user.name, lastName: user.lastName, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// User login logic
let logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check if user exists
    let userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare passwords
    let isPasswordCorrect = await bcrypt.compare(password, userExist.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate token
    let token = jwt.sign(
      { email: userExist.email, userId: userExist._id },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    // Respond with token
    res.status(200).json({
      message: "Login successful",
      token: token,
      userName: { name: userExist.name },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { signIn, logIn };





