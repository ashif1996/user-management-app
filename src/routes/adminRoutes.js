const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const { isAdmin, isAdminLoggedIn } = require('../middlewares/authMiddleware');

router.get('/login', adminController.getAdminLogin);
router.get('/register', adminController.getAdminRegister);
router.post('/login', adminController.adminLogin);
router.post('/register', adminController.adminRegister);
router.get('/logout', adminController.adminLogout);
router.get('/dashboard', isAdmin, isAdminLoggedIn, adminController.getDashboard);
router.get('/addUser', isAdmin, isAdminLoggedIn, adminController.getAddUser);
router.post('/addUser', isAdmin, isAdminLoggedIn, adminController.addUser);
router.get('/viewUser/:id', isAdmin, isAdminLoggedIn, adminController.viewUser);
router.get('/editUser/:id', isAdmin, isAdminLoggedIn, adminController.getEditUser);
router.put('/editUser/:id', isAdmin, isAdminLoggedIn, adminController.editUser);
router.post('/deleteUser/:id', isAdmin, isAdminLoggedIn, adminController.deleteUser);
router.post('/searchUser', isAdmin, isAdminLoggedIn, adminController.searchUser);

module.exports = router;