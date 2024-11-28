import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller.js";
import verifyToken from "../middlewares/verifyToken.middleware.js";

const router = Router()

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/hi',  verifyToken, (req, res) => {
  res.send('Hello World!');
});
router.get('/logout', (req, res) => {
  res.clearCookie('token').json({ message: 'Logged out' });
});

export default router;
