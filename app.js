require('dotenv').config();
const express = require('express');
const path = require('path');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');
const mongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const nocache = require('nocache');

const connectDB = require('./src/config/db');
connectDB();

const app = express();

app.use(expressLayouts);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/adminLayout');
app.set('layout', 'layouts/userLayout');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: mongoStore.create({ mongoUrl: process.env.MONGODB_URL }),
}));

app.use(flash());
app.use(nocache());

app.get('/', (req, res) => {
    return res.redirect('/users/login');
});

const adminRouter = require('./src/routes/adminRoutes');
const userRouter = require('./src/routes/userRoutes');

app.use('/admin', adminRouter);
app.use('/users', userRouter);

app.use((req, res, next) => {
    next(createError(404));
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    console.error(`Error encountered: ${err.message}`);
    res.status(err.status || 500);
    res.render('error');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;