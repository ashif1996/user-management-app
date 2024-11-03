const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.MY_APP_JWT_SECRET;
const User = require('../models/userSchema');

const getAdminLogin = (req, res) => {
    const locals = { title: 'Admin Login' };

    return res.render('admin/adminLogin', {
        locals,
        layout: 'layouts/authLayout',
        success: req.flash('success'),
        error: req.flash('error'),
    });
};

const getAdminRegister = (req, res) => {
    const locals = { title: 'Admin Register' };

    return res.render('admin/register', {
        locals,
        layout: 'layouts/authLayout',
        success: req.flash('success'),
        error: req.flash('error'),
    });
};

const adminRegister = async (req, res) => {
    const { firstName, lastName, email, pwd, pwdConf } = req.body;
    const isExist = await User.findOne({ email, isAdmin: true });

    if (isExist) {
        req.flash('error', 'Admin already exists');
        return res.redirect('/admin/login');
    } else if (pwd.length < 6 || pwdConf.length < 6) {
        req.flash('error', 'Password should be atleast 6 characters');
        return res.redirect('/admin/register');
    } else if (pwd !== pwdConf) {
        req.flash('error', 'Passwords does not match');
        return res.redirect('/admin/register');
    } else {
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: pwd,
            isAdmin: true,
        });

        if (user) {
            req.flash('success', 'Admin registered successfully');
            return res.redirect('/admin/login');
        } else {
            req.flash('error', 'Admin registration failed');
            return res.redirect('/admin/register');
        }
    }
};

const adminLogin = async (req, res) => {
    const { email, pwd } = req.body;

    if (!email || !pwd) {
        req.flash('error', 'Email and Password are required');
        return res.redirect('/admin/login');
    } else {
        const user = await User.findOne({ email, isAdmin: true });

        if (!user) {
            req.flash('error', 'Admin not found');
            return res.redirect('/admin/login');
        } else {
            const validatePwd = await bcrypt.compare(pwd, user.password);

            if (!validatePwd) {
                req.flash('error', 'Invalid Credentials');
                return res.redirect('/admin/login');
            } else {
                const maxAge = 3 * 60 * 60;
                const token = jwt.sign({ id: user._id, user, role: 'Admin' }, jwtSecret, { expiresIn: maxAge });
                res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                req.flash('success', 'Logged in successfully');
                req.session.admin = user;

                return res.redirect('/admin/dashboard');
            }
        }
    }
};

const adminLogout = (req, res) => {
    req.session.destroy();
    return res.redirect('/admin/login');
};

const sendErrorResponse = (req, res, path, err) => {
    console.error(err);
    req.flash('error', err);
    return res.redirect(path);
};

const sendSuccessResponse = (req, res, path, message) => {
    req.flash('success', message);
    return res.redirect(path);
};

const getDashboard = async (req, res) => {
    const messages = await req.flash("info");

    try {
        const perPage = 12;
        const page = req.query.page || 1;

        const users = await User.aggregate([
            {$sort: {createdAt: -1}}, 
            {$skip: (perPage * page) - perPage}, 
            {$limit: perPage},
        ]).exec();

        const count = await User.countDocuments();

        return res.render('admin/dashboard', {
            title: 'User Management',
            users,
            count,
            current: page,
            pages: Math.ceil(count / perPage),
            messages,
            success: req.flash('success'),
            error: req.flash('error'),
            layout: 'layouts/adminLayout',
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
    }
};

const getAddUser = (req, res) => {
    const locals = { title: 'Add User' };

    return res.render('admin/add', {
        locals,
        layout: 'layouts/adminLayout',
        success: req.flash('success'),
        error: req.flash('error'),
    });
};

const addUser = async (req, res) => {
    try {
        const { firstName, lastName, email, pwd, pwdConf } = req.body;

        if (await User.findOne({ email, isAdmin: false })) {
            return sendErrorResponse(req, res, '/admin/addUser', 'User already exists');
        } else if (pwd.length < 6 || pwdConf.length < 6) {
            return sendErrorResponse(req, res, '/admin/addUser', 'Password is less than 6 characters');
        } else if (pwd !== pwdConf) {
            return sendErrorResponse(req, res, '/admin/addUser', 'Password does not match');
        } else {
            const user = await User.create({
                firstName,
                lastName,
                email,
                password: pwd,
            });

            if (user) {
                return sendSuccessResponse(req, res, '/admin/dashboard', 'User created successfully');
            } else {
                return sendErrorResponse(req, res, '/admin/addUser', 'User not created');
            }
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
    }
};

const viewUser = async (req, res) => {
    try {
        const locals = { title: 'View User' };
        const user = await User.findById(req.params.id);

        return res.render('admin/view', {
            locals,
            layout: 'layouts/adminLayout',
            user,
            success: req.flash('success'),
            error: req.flash('error'),
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

const getEditUser = async (req, res) => {
    const locals = { title: 'Edit User' };

    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            req.flash('error', 'User not found');
            return res.redirect('/admin/dashboard');
        }
        
        return res.render('admin/edit', {
            locals,
            layout: 'layouts/adminLayout',
            user,
            success: req.flash('success'),
            error: req.flash('error'),
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

const editUser = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: Date.now() });
        sendSuccessResponse(req, res, '/admin/dashboard', 'User updated successfully');
    } catch (err) {
        sendErrorResponse(req, res, '/admin/dashboard', 'Internal server error');
    }
};

const deleteUser = async (req, res) => {
    try {
        await User.deleteOne({ _id: req.params.id });
        sendSuccessResponse(req, res, '/admin/dashboard', 'User deleted successfully');
    } catch (err) {
        sendErrorResponse(req, res, '/admin/dashboard', 'Internal server error');
    }
};

const searchUser = async (req, res) => {
    try {
        const searchTerm = req.body.searchTerm.replace(/[^a-zA-Z0-9 ]/g, '');

        const users = await User.find({
            $or: [
                {firstName: {$regex: searchTerm, $options: 'i'}},
                {lastName: {$regex: searchTerm, $options: 'i'}},
                {email: {$regex: searchTerm, $options: 'i'}},
            ]
        });

        return res.render('admin/search', {
            title: 'Search User Data',
            users,
            layout: 'layouts/adminLayout',
        });
    } catch (err) {
        sendErrorResponse(req, res, '/admin/dashboard', 'Internal server error');
    }
};

module.exports = {
    getAdminLogin,
    getAdminRegister,
    adminRegister,
    adminLogin,
    adminLogout,
    getDashboard,
    getAddUser,
    addUser,
    viewUser,
    getEditUser,
    editUser,
    deleteUser,
    searchUser,
};