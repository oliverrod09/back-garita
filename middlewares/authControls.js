const jwt = require("jsonwebtoken");

const Validate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log(authHeader);
  if (!authHeader) {
    return res.status(400).json({ message: "Authorization header not present" });
  }
  const token = req.headers["authorization"].split(" ")[1];
  if (!token) {
    return res.status.json({ message: "you have not sent the token" });
  }
  jwt.verify(token, process.env.ADMIN_KEY, (error, data) => {
    if (error) {
      return res.status(404).json({ message: "Invalid token", token: token });
    }
    console.log(data);
    next();
  });
};

module.exports = Validate;
