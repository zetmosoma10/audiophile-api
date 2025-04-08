# EXPRESS API - AUDIOPHILE API

A RESTful API built with **NodeJS** , **Express.js**, and **MongoDB** to manage Orders, Users and Products

## FEATURES

- User Registration & Login (JWT Auth)
- User Forgot & Reset Password (JWT Auth)
- Delete User Account
- CRUD Operation for Orders
- Order status management (Pending, Shipped, Delivered, Cancelled)
- CRUD Operation for Carts
- Email Notification ( Order created, Shipped, Delivered, Cancelled)
- Real-time Email sending with Nodemailer
- Update Products details ( Prices, Discounts, Number in Stock)
- Clean and scalable project structure

## Tech Stack

- Node.js
- Express.js
- MongoDB & Mongoose
- Nodemailer (for sending emails)
- JWT Authentication
- Joi (for data validation)

## GETTING STARTED

### 1. Clone the Repository

```bash
git clone https://github.com/zetmosoma10/audiophile-api.git
cd audiophile-api
```

### 2. Install Dependencies

npm install

### 3. Create .env file

At the root of the project create .env file and add:

PORT=3000
DB_CONN_STR=your_db_con_str
FRONTEND_CLIENT_URL=your_client_url_app
FRONTEND_ADMIN_URL=your_admin_url_app
JWT_SECRET_STR=your_secret
JWT_EXPIRES=your_expire_time
EMAIL_HOST=your_email_host
EMAIL_SERVICES=your_email_services
EMAIL_USER=your_email
EMAIL_PORT=your_email_port
EMAIL_PASS=your_email_password

## 4. Start the server

node server.js

The Server will run at http://localhost:3000

### API Endpoints

**Auth**
POST /api/auth/register ----(Register a new User)
POST /api/auth/login ----(Login User)
POST /api/auth/forgotPassword ----(Forgot Password)
PATCH /api/auth/resetPassword ----(Rest Password)

**Customers**
GET /api/customers/me ----(Get current logged in Customer)
POST /api/customers/delete-profile-account ----(Delete logged in Customer Account)
GET /api/admin/customers ----(Get all Customers)
DELETE /api/admin/customers/:id ----(Delete a Customers)

**Cart**
POST /api/carts ----(Add Item to Cart)
Get /api/carts ----(Get Items in Cart)
PATCH /api/carts ----(Update item quantity in Cart)
DELETE /api/carts ----(Delete item in Cart)

**Orders**
POST /api/orders ----(Create Order)
GET /api/orders ----(Get all your Orders)
GET /api/orders/:id ----(Get Order by id)
GET /api/admin/orders ----(Get all Orders)
GET /api/admin/orders/:id ----(Get Order by id)
PATCH /api/admin/orders/:id ----(Update Order status)
DELETE /api/admin/orders/:id ----(Delete Order by id)

**PRODUCTS**
POST /api/products ----(Create product)
GET /api/products/:id ----(Get products by category id)
GET /api/product/product-detail/:id ----(Get product by id)
PATCH /api/product/product-detail/:id ----(Update product by id)
DELETE /api/product/product-detail/:id ----(Delete product by id)

**SERVER HEALTH**
GET /api/health ----(Checks if server is up and running)
