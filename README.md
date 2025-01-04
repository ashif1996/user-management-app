# 🧑‍💻 User Management App - Node.js CRUD Operations

The **User Management App** is a Node.js project designed to manage user accounts with basic **CRUD** (Create, Read, Update, Delete) operations. This application allows admin users to manage user profiles, login, registration, and perform administrative tasks like searching and editing user details.

## 🚀 Features

- **User Authentication**:  
  - Register, login, and manage user accounts.  
  - Admin login for managing users.  

- **User Profile Management**:  
  - Create, update, view, and delete user profiles.  

- **Admin Dashboard**:  
  - Admin can view, search, and edit user details.  

- **Error Handling**:  
  - Display appropriate error messages for failed actions.  

## 🛠️ Tech Stack

- **Backend**: Node.js, Express  
- **Database**: MongoDB  
- **Frontend**: EJS, CSS (Admin and User styles)  
- **Authentication**: JWT (JSON Web Token)  
- **Middleware**: Custom authentication middleware

## 📂 Project Structure

```plaintext
user-management-app/
├── public/                     # Static files
│   ├── css/                    # CSS files
│   │   ├── admin.css           # Admin styles
│   │   └── user.css            # User styles
├── src/
│   ├── config/                 # Configuration files
│   │   └── db.js               # Database connection
│   ├── controllers/            # Controller files
│   │   ├── adminController.js  # Admin-specific controllers
│   │   └── userController.js   # User-specific controllers
│   ├── middlewares/            # Middleware files
│   │   └── authMiddleware.js   # Authentication middleware
│   ├── models/                 # Mongoose models
│   │   └── userSchema.js       # User schema
│   ├── routes/                 # Routing files
│   │   ├── adminRoutes.js      # Admin routes
│   │   └── userRoutes.js       # User routes
│   ├── views/                  # Views (EJS templates)
│   │   ├── admin/              # Admin views
│   │   │   ├── add.ejs         # Add user page
│   │   │   ├── adminLogin.ejs  # Admin login page
│   │   │   ├── dashboard.ejs   # Admin dashboard
│   │   │   ├── edit.ejs        # Edit user page
│   │   │   └── register.ejs    # Admin register page
│   │   ├── user/               # User views
│   │   │   ├── profile.ejs     # User profile page
│   │   │   ├── signup.ejs      # User signup page
│   │   │   ├── userLogin.ejs   # User login page
│   │   │   └── index.ejs       # User homepage
│   │   ├── layouts/            # Layouts for the views
│   │   │   ├── adminLayout.ejs # Admin layout
│   │   │   ├── authLayout.ejs  # Authentication layout
│   │   │   └── userLayout.ejs  # User layout
│   │   └── partials/           # Partials for reuse
│   │       ├── admin/          # Admin partials (header, sidebar)
│   │       └── user/           # User partials (header)
├── .gitignore                  # Git ignore file
├── app.js                       # Main application file
├── package-lock.json            # Package lock file
├── package.json                 # Project dependencies and scripts
```

## 🔧 Setup and Installation

### Prerequisites

- Node.js (v14+)
- MongoDB

### Steps

1. **Clone the repository**:  
   ```bash
   git clone https://github.com/your-username/user-management-app.git
   cd user-management-app
   ```

2. **Install dependencies**:  
   ```bash
   npm install
   ```

3. **Set up the database**:  
   - Ensure MongoDB is running locally or use a cloud MongoDB instance.
   - Configure the database connection in `src/config/db.js`.

4. **Run the application**:  
   ```bash
   npm start
   ```

5. Visit `http://localhost:3000/` to view the application.

## 📜 Usage

- **Admin Dashboard**:  
  - View, edit, add, and delete user accounts.
  
- **User Login/Signup**:  
  - Users can register, login, and view their profiles.

## 🌱 Learning Outcomes

- Understanding how to build a full-stack application using Node.js and MongoDB.
- Implementing CRUD operations with Express and MongoDB.
- Securing routes with authentication middleware.
- Using EJS for templating and dynamic HTML rendering.
- Structuring a Node.js project with multiple routes, controllers, and views.

## 📜 License

This project is licensed under the **MIT License**. Feel free to use and modify it as per your needs.

## 🌟 Acknowledgements

- Special thanks to the Node.js and Express communities for their resources and contributions.