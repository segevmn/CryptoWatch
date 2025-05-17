const jwt = require('jsonwebtoken');

const JWT_SECRET = 'cryptosecerts';

exports.isAuth = (req, res, next) => {
  const token = req.get('Authorization');
  console.log(token);

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const actualToken = token.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(actualToken, JWT_SECRET);
  } catch (err) {
    return res.status(500).json({ message: 'Token verification failed' });
  }

  if (!decodedToken) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  req.userId = decodedToken.userId;
  next();
};
