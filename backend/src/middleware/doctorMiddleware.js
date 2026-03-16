const doctorOnly = (req, res, next) => {
  if (req.user && req.user.role === "doctor") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as Doctor" });
  }
};

module.exports = doctorOnly;
