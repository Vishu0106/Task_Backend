import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {


  const token = req.cookies.token || req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
    });

    next();
  } catch (error) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }
};

export default verifyToken;
