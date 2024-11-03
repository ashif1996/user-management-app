const jwtSecret = process.env.MY_APP_JWT_SECRET;
const jwt = require('jsonwebtoken');
const util = require('util');

const verifyToken = util.promisify(jwt.verify);

const extractToken = (req) => {
    return req.cookies.jwt || req.header('Authorization')?.replace('Bearer ', '');
};

const isUser = async (req, res, next) => {
    const token = extractToken(req);
    if (!token) {
        req.flash('error', 'Not authenticated. Please log in.');
        return res.redirect('/users/login');
    }

    try {
        const decodedToken = await verifyToken(token, jwtSecret);
        if (decodedToken.role !== 'User') {
            req.flash('error', 'Not authorized. Please log in with a valid user account.');
            return res.redirect('/users/login');
        }

        req.user = decodedToken;
        next();
    } catch (err) {
        req.flash('error', 'Authentication failed. Please try again.');
        return res.redirect('/users/login');
    }
};

const isLoggedIn = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        req.flash('error', 'You must be logged in to view this page');
        return res.redirect('/users/login');
    }
};

const isLoggedOut = (req, res, next) => {
    if (req.session && req.session.user) {
        return res.redirect('/users/home');
    } else {
        next();
    }
};

const isAdmin = async (req, res, next) => {
    const token = extractToken(req);
    if (!token) {
        req.flash('error', 'Not authenticated. Please log in.');
        return res.redirect('/admin/login');
    }

    try {
        const decodedToken = await verifyToken(token, jwtSecret);
        if (decodedToken.role !== 'Admin') {
            req.flash('error', 'Not authorized. Please log in with a valid admin account.');
            return res.redirect('/admin/login');
        }

        req.admin = decodedToken;
        next();
    } catch (err) {
        req.flash('error', 'Authentication failed. Please try again.');
        return res.redirect('/admin/login');
    }
};

const isAdminLoggedIn = (req, res, next) => {
    if (req.session && req.session.admin) {
        next();
    } else {
        req.flash('error', 'You must be logged in to view this page');
        return res.redirect('/admin/login');
    }
};

module.exports = {
    isUser,
    isLoggedIn,
    isLoggedOut,
    isAdmin,
    isAdminLoggedIn,
};