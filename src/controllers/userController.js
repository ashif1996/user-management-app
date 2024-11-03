const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.MY_APP_JWT_SECRET;
const User = require('../models/userSchema');

const userHome = (req, res) => {
    const locals = { title: 'Home Page' };

    return res.render('index', {
        locals,
        layout: 'layouts/userLayout',
        success: req.flash('success'),
        error: req.flash('error'),
        user: req.session.user,
    });
};

const getUserLogin = (req, res) => {
    const locals = { title: 'User Login' };

    return res.render('user/userLogin', {
        locals,
        layout: 'layouts/authLayout',
        user: null,
        success: req.flash('success'),
        error: req.flash('error'),
    });
};

const getUserRegister = (req, res) => {
    const locals = { title: 'User Registration' };

    return res.render('user/signup', {
        locals,
        layout: 'layouts/authLayout',
        success: req.flash('success'),
        error: req.flash('error'),
    });
};

const userRegister = async (req, res) => {
    const { firstName, lastName, email, pwd, pwdConf } = req.body;
    const isExist = await User.findOne({ email });

    if (isExist) {
        req.flash('error', 'User already exist, Please login');
        return res.redirect('/users/login');
    } else if (pwd.length < 6 || pwdConf.length < 6) {
        req.flash('error', 'Password is less than 6 characters');
        return res.redirect('/users/signup');
    } else if (pwd !== pwdConf) {
        req.flash('error', 'Password does not match');
        return res.redirect('/users/signup');
    } else {
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: pwd,
        });

        if (user) {
            req.flash('success', 'User registered successfully');
            return res.redirect('/users/login');
        } else {
            req.flash('error', 'User not created');
            return res.redirect('/users/signup');
        }
    }
};

const userLogin = async (req, res) => {
    const { email, pwd } = req.body;
    if (!email || !pwd) {
        req.flash('error', 'Email and Password are required');
        return res.redirect('/users/login');
    }

    try {
        const user = await User.findOne({ email, isAdmin: false });
        if (!user) {
            req.flash('error', 'User not found');
            return res.redirect('/users/login');
        }

        const validatePwd = await bcrypt.compare(pwd, user.password);
        if (!validatePwd) {
            req.flash('error', 'Invalid Credentials');
            return res.redirect('/users/login');
        }

        const maxAge = 3 * 60 * 60;
        const token = jwt.sign({ id: user._id, user, role: 'User' }, jwtSecret, { expiresIn: maxAge });
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        req.flash('success', 'Logged in successfully');
        req.session.user = user;

        return res.redirect('/users/home');
    } catch (err) {
        req.flash('error', 'An unexpected error occurred');
        return res.redirect('/users/login');
    }
};

const getProfile = async (req, res) => {
    const locals = { title: 'User Profile' };
    const email = req.session.user.email;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            req.flash('error', 'User not found');
            return res.redirect('/users/login');
        }

        return res.render('user/profile', {
            locals,
            layout: 'layouts/userLayout',
            user,
            success: req.flash('success'),
            error: req.flash('error'),
        });
    } catch (err) {
        console.error(err);
        req.flash('error', 'An error occurred while fetching the profile');
        return res.redirect('/users/home');
    }
};

const userLogout = (req, res) => {
    req.flash('success', 'You have been Logged out successfully');
    req.session.destroy();
    return res.redirect('/users/login');
};

module.exports = {
    userHome,
    getUserLogin,
    getUserRegister,
    userRegister,
    userLogin,
    getProfile,
    userLogout,
};