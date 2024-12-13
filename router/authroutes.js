const express = require("express");
const { signup, signin } = require("../controller/authcontroller");
const { authenticate } = require("../middleware/authmiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);

// Example of a protected route
router.get("/protected", authenticate, (req, res) => {
  res.send({ message: `Welcome ${req.user.username}` });
});
const { forgotPassword, resetPassword } = require('../controller/authcontroller');

// Forgot password route
router.post('/forgot-password', forgotPassword);

// Reset password route
router.post('/reset-password', resetPassword);

module.exports = router;
