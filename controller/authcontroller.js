const user = require("../model/user_schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY =  "your_jwt_secret_key"; // Use environment variables for better security

// Signup functio 
exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the email already exists
    const existingUsers = await user.find({ email }); // Find returns an array
    if (existingUsers.length > 0) {
      return res.status(400).send({ message: "Email already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const userData = { email, password: hashedPassword };
    const newUser = await user.create(userData);

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: { email: newUser.email },
    });
  } catch (error) {
    console.error("Error in signup:", error.message);
    res.status(500).send({ message: "Internal server error." });
  }
};
// Signin function
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const existingUser = await user.findOne({ email }); 
    if (!existingUser) {
      return res.status(400).send({ message: "Invalid email or password." });
    }

    // Compare the hashed password
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(400).send({ message: "Invalid email or password." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      SECRET_KEY,
      { expiresIn: "1h" }
    );
     console.log(token)
    // Send response including token and user details
    res.status(200).send({
      token,
      message: "Login successful.",
      user: {
        email: existingUser.email, 
        _id: existingUser._id, // Make sure this is included
      },
    });
  } catch (error) {
    console.error("Error in signin:", error.message);
    res.status(500).send({ message: "Internal server error." });
  }
};


exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const decoded = jwt.verify(token, SECRET_KEY);
    const email = decoded.email;

    const users = await user.find({ email });
    if (users.length === 0) {
      return res.status(400).send({ message: "User not found." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.findOneAndUpdate({ email }, { password: hashedPassword });

    res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error("Error in resetPassword:", error.message);
    if (error.name === "JsonWebTokenError") {
      return res.status(400).send({ message: "Invalid or expired token." });
    }
    res.status(500).send({ message: "Internal server error." });
  }
};

// Forgot Password function
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user exists
    const users = await user.find({ email }); // Find returns an array
    if (users.length === 0) {
      return res.status(400).send({ message: "User not found." });
    }

    const existingUser = users[0]; // Access the first user in the array

    // Generate a reset password token (with expiration time)
    const resetToken = jwt.sign({ email: existingUser.email }, SECRET_KEY, { expiresIn: "15m" });

    // Send the token to the user (e.g., via email - integration required)
    // For now, return the token in the response
    res.status(200).send({ message: "Password reset token generated.", token: resetToken });
  } catch (error) {
    console.error("Error in forgotPassword:", error.message);
    res.status(500).send({ message: "Internal server error." });
  }
};
