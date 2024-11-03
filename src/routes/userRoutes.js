const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { isLoggedIn, isLoggedOut, isUser } = require('../middlewares/authMiddleware');

router.get('/login', isLoggedOut, userController.getUserLogin);
router.get('/signup', isLoggedOut, userController.getUserRegister);
router.post('/login', userController.userLogin);
router.post('/signup', userController.userRegister);
router.get('/home', isLoggedIn, isUser, userController.userHome);
router.get('/profile', isLoggedIn, isUser, userController.getProfile);
router.get('/logout', userController.userLogout);

module.exports = router;