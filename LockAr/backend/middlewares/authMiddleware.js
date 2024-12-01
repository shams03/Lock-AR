const jwt = require("jsonwebtoken");

exports.authenticateToken = (req, res, next) => {
  const token = req.header("token");

  if (!token)
    return res.sendStatus(401).json({ message: " Token doesn't exist. " });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res
        .sendStatus(403)
        .json({ message: " Invalid or expired token. " });
    }
    req.user = user;
    next();
  });
};
