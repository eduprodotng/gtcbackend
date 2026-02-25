const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    console.log("Authorization header is missing");
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.log("Token is missing in header");
    return res.status(401).json({ message: "Unauthorized: Token missing" });
  }
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
    if (error) {
      jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
        if (error) return res.sendStatus(403);

        req.user = user;
        next();
      });
    } else {
      req.user = user;
      next();
    }
  });
};
