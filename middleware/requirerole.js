module.exports = expectedRole => (req, res, next) => {
  if (!req.user || req.user.role !== expectedRole)
    return res.status(403).json({ message: 'Forbidden' });
  next();
};
