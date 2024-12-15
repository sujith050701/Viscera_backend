const jwt = require('jsonwebtoken');
const SECRET_KEY = "your_jwt_secret_key";

exports.authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).send({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Attach the user details (like `id`) to the request
    // Ensure that the user ID is present in the decoded token
    if (!req.user.id) {
      return res.status(401).send({ message: "User ID is missing in the token." });
    } 
    next();
  } catch (error) {
    res.status(401).send({ message: "Invalid or expired token." });
  }
};
