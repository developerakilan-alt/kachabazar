# Kachabazar Ecommerce - Complete Beginner's Guide

## What is this project?

This is a **full-stack ecommerce website** (jewellery store) with **3 parts** that work together:

```
┌─────────────────────────────────────────────────────────┐
│                    KACHABAZAR ECOSYSTEM                  │
│                                                         │
│   ┌──────────────┐    ┌──────────────┐    ┌───────────┐ │
│   │   BACKEND    │◄───│    STORE     │    │   ADMIN   │ │
│   │  (API/Server)│───►│  (Frontend)  │    │  (Panel)  │ │
│   │              │    │              │    │           │ │
│   │  Port: 5056  │    │  Port: 3000  │    │ Port: 4100│ │
│   │  Express.js  │    │   Next.js    │    │   Vite    │ │
│   │   MongoDB    │    │  (React)     │    │  (React)  │ │
│   └──────────────┘    └──────────────┘    └───────────┘ │
│         ▲                    ▲                  ▲        │
│         │                    │                  │        │
│         └──────────┬─────────┘                  │        │
│                    │                            │        │
│         ┌──────────┴──────────┐                 │        │
│         │     MONGODB         │                 │        │
│         │  (Cloud Database)   │                 │        │
│         └─────────────────────┘                 │        │
└─────────────────────────────────────────────────────────┘
```

| Part | What it does | Who uses it |
|---|---|---|
| **Backend** | The brain - stores data in MongoDB, handles logins, payments, etc. | Nobody directly (Store & Admin talk to it) |
| **Store** | The shop website - customers browse products, add to cart, checkout | Customers |
| **Admin** | The control panel - manage products, orders, staff, settings | Store owner / Staff |

---

## Technologies Used (Simplified)

| Technology | What it does |
|---|---|
| **Node.js** | Runs JavaScript on the server (not just in browser) |
| **Express.js** | Helps create the API/server easily |
| **MongoDB** | A database (like Excel sheets but for code) |
| **Mongoose** | Helps JavaScript talk to MongoDB |
| **React** | Library for building the user interface |
| **Next.js** | React framework (for the Store frontend) |
| **Vite** | Tool to run React fast (for Admin panel) |
| **Tailwind CSS** | Makes the website look pretty without writing much CSS |
| **JWT** | A secure way to handle login sessions (like a digital ID card) |
| **Stripe/Razorpay/PayPal** | Payment gateways (process credit cards) |

---

## Prerequisites (What You Need Installed)

### 1. Install Node.js (Required)
Node.js lets you run JavaScript on your computer.

- Download from: https://nodejs.org/ (use **v18.18.2** or later)
- After installing, open terminal and check:
  ```bash
  node --version    # Should show v18.x.x or higher
  npm --version     # Should show 10.x.x or higher
  ```

### 2. Install VS Code (Recommended)
A code editor to write/edit code. Download from: https://code.visualstudio.com/

### 3. Get a MongoDB Database (Required)
MongoDB is where all data is stored (products, users, orders, etc.).

**Step-by-step to get free MongoDB:**

1. Go to https://www.mongodb.com/atlas
2. Sign up for a free account
3. Create a **free cluster** (M0 Sandbox - it's free forever)
4. Under "Security" > "Database Access" > Add a user (create username + password)
5. Under "Security" > "Network Access" > Add IP Address > Click "Allow Access from Anywhere" (for development)
6. Under "Databases" > "Connect" > "Connect your application"
7. Copy the connection string - it looks like:
   ```
   mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/kachabazar
   ```
8. Replace `<password>` with the password you created

---

## How to Run the Project (Step by Step)

### Step 1: Set up the Backend

```bash
# 1. Open terminal and go to backend folder
cd kachabazar/backend

# 2. Install all dependencies (packages the project needs)
npm install

# 3. Create environment file (copy the example)
cp .env.example .env
# On Windows: copy .env.example .env
```

#### 4. Edit the `.env` file (the most important step!)
Open `kachabazar/backend/.env` in VS Code and update these values:

```env
PORT=5056
MONGO_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/kachabazar
#                ↑ Replace with your MongoDB connection string
```

> **What is `.env`?** It's like a secret notes file where we store passwords and settings. It's never shared on GitHub (listed in `.gitignore`).

#### 5. Seed the database (add demo data)

```bash
npm run data:import
```

This adds sample products, categories, customers, orders, etc. to your MongoDB.

> **Warning:** This will DELETE all existing data first and then add fresh demo data. Type "yes" then "DELETE EVERYTHING" when prompted.

#### 6. Start the backend server

```bash
npm run dev
```

If successful, you'll see:
```
Server is running on http://localhost:5056
MongoDB connected successfully
```

**Keep this terminal running!** The backend must stay running for Store and Admin to work.

---

### Step 2: Set up the Store (Frontend - Customer Website)

Open a **new terminal** (don't close the backend one):

```bash
# 1. Go to store folder
cd kachabazar/store

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.development
# On Windows: copy .env.example .env.development
```

The `.env.development` file should already have the correct values for local development. The important one is:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5056/v1
# This tells the store: "Talk to the backend at this address"
```

#### 4. Start the store

```bash
npm run dev
```

Open your browser and go to: **http://localhost:3000**

You should see the jewellery store website! 🎉

---

### Step 3: Set up the Admin Panel

Open **another new terminal**:

```bash
# 1. Go to admin folder
cd kachabazar/admin

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env
# On Windows: copy .env.example .env
```

The `.env` file should already have correct values. The important one is:

```env
VITE_APP_API_BASE_URL=http://localhost:5056/v1
# This tells the admin: "Talk to the backend at this address"
```

#### 4. Start the admin panel

```bash
npm run dev
```

Open your browser and go to: **http://localhost:4100**

**Login credentials** (from seed data):
- Email: `admin@example.com`
- Password: `123456`

---

## Quick Start Summary

If everything is set up already, here's all you need:

```bash
# Terminal 1: Backend
cd kachabazar/backend && npm run dev

# Terminal 2: Store
cd kachabazar/store && npm run dev

# Terminal 3: Admin
cd kachabazar/admin && npm run dev
```

| Service | URL |
|---|---|
| Backend API | http://localhost:5056 |
| Store (Shop) | http://localhost:3000 |
| Admin Panel | http://localhost:4100 |

---

## How Backend Connects to Store & Admin (The API)

The backend is like a **waiter in a restaurant**:

```
STORE (Customer)            BACKEND (Waiter)           MONGODB (Kitchen)
      │                          │                          │
      │  "Show me all products"  │                          │
      ├─────────────────────────►│                          │
      │                          │  "Fetch products from DB"│
      │                          ├─────────────────────────►│
      │                          │     "Here are products"  │
      │                          │◄─────────────────────────┤
      │  "Here are the products" │                          │
      │◄─────────────────────────┤                          │
      │                          │                          │
```

**In technical terms:**

1. Store/Admin make **HTTP requests** (like clicking a link or submitting a form)
2. These requests go to the Backend at `http://localhost:5056/v1/...`
3. Backend talks to MongoDB to get/save data
4. Backend sends back a response (usually JSON format)
5. Store/Admin display the data beautifully

**Example:** When you visit the Store homepage, it calls:
```
GET http://localhost:5056/v1/products/store
```
The backend fetches products from MongoDB and sends them back as JSON.

**How it's configured in code:**

| File | What it does |
|---|---|
| `store/.env.development` | Sets `NEXT_PUBLIC_API_BASE_URL=http://localhost:5056/v1` |
| `admin/.env` | Sets `VITE_APP_API_BASE_URL=http://localhost:5056/v1` |
| `store/src/services/CommonService.js` | Creates the base URL and handles API calls |
| `store/src/services/httpServices.js` | Creates an Axios instance (tool for making HTTP requests) |
| `admin/src/services/httpService.js` | Same thing for Admin - Axios instance with auth tokens |

---

## How MongoDB is Connected

### The Connection Setup

The magic happens in `backend/config/db.js`:

```javascript
// Simplified version of what happens:
const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected successfully');
};
```

When the backend starts (`npm run dev`):
1. It reads `MONGO_URI` from `.env` file
2. Uses Mongoose (a library) to connect to MongoDB Atlas (cloud database)
3. Once connected, the backend can save/read/update/delete data

### What's in the Database?

When you run `npm run data:import`, it creates these **collections** (like Excel sheets):

| Collection | What it stores | Example data |
|---|---|---|
| `products` | All products | Name, price, images, stock |
| `categories` | Product categories | Necklaces, Rings, Earrings |
| `customers` | Registered users | Name, email, address |
| `orders` | Customer orders | Items, total, status |
| `admins` | Staff accounts | Admin, manager, staff |
| `reviews` | Product reviews | Rating, comment |
| `coupons` | Discount codes | SAVE10, WELCOME20 |
| `settings` | Store settings | Currency, tax, logo |
| `currencies` | Supported currencies | USD, EUR, GBP |
| `languages` | Store languages | English, German |

---

## Project Folder Structure Explained

```
kachabazar/                           # Main project folder
│
├── backend/                          # THE SERVER (API)
│   ├── api/index.js                  # Entry point - starts the server
│   ├── config/
│   │   ├── db.js                     # MongoDB connection code
│   │   └── auth.js                   # JWT login/security code
│   ├── models/                       # Data structure definitions
│   │   ├── Product.js                # What fields a product has
│   │   ├── Order.js                  # What fields an order has
│   │   └── ...                       # 19 model files total
│   ├── routes/                       # API endpoints/URLs
│   │   ├── productRoutes.js          # /v1/products/... endpoints
│   │   ├── orderRoutes.js            # /v1/orders/... endpoints
│   │   └── ...                       # 19 route files total
│   ├── controller/                   # Actual logic for each endpoint
│   │   ├── productController.js      # What to do when products API is called
│   │   ├── orderController.js        # What to do when orders API is called
│   │   └── ...
│   ├── middleware/                    # Runs between request and response
│   │   └── validators.js             # Validates input data
│   ├── lib/                          # Helper services
│   │   ├── email-sender/             # Sends emails (invoices, OTP)
│   │   ├── phone-verification/       # SMS verification
│   │   ├── stripe/                   # Payment processing
│   │   └── paypal/                   # PayPal integration
│   ├── script/seed.js                # Script to fill DB with demo data
│   └── utils/                        # Demo data files
│       ├── products.js               # Sample products
│       ├── categories.js             # Sample categories
│       └── ...
│
├── store/                            # THE SHOP FRONTEND (Next.js)
│   ├── src/
│   │   ├── app/                      # Pages (Next.js App Router)
│   │   │   ├── page.jsx              # Homepage
│   │   │   ├── product/[slug]/       # Product detail page
│   │   │   ├── checkout/             # Checkout page
│   │   │   ├── auth/login/           # Login page
│   │   │   └── user/dashboard/       # User account page
│   │   ├── components/               # Reusable UI pieces
│   │   │   ├── header/               # Navigation bar
│   │   │   ├── footer/               # Footer
│   │   │   ├── product/              # Product cards, grids
│   │   │   └── cart/                 # Cart components
│   │   ├── lib/actions/              # Server functions (talk to API)
│   │   │   ├── product.actions.js    # Fetch products from backend
│   │   │   ├── order.actions.js      # Create orders
│   │   │   └── auth.actions.js       # Login/Register
│   │   └── services/                 # API communication layer
│   │       ├── CommonService.js       # Base URL and fetch setup
│   │       └── httpServices.js        # Axios instance
│   └── public/                       # Images, icons
│
├── admin/                            # THE ADMIN PANEL (Vite + React)
│   ├── src/
│   │   ├── main.jsx                  # Entry point
│   │   ├── App.jsx                   # Root component with routing
│   │   ├── pages/                    # Admin pages
│   │   │   ├── Dashboard.jsx         # Stats overview
│   │   │   ├── Products.jsx          # Manage products
│   │   │   ├── Orders.jsx            # Manage orders
│   │   │   └── ...                   # 25+ pages
│   │   ├── services/                 # API calls
│   │   │   └── httpService.js        # Axios instance with auth
│   │   └── components/               # Reusable UI components
│   └── public/                       # Icons, favicon
│
└── documentation/                    # Guides & docs
```

---

## How Data Flows (Complete Example)

Let's trace what happens when a customer places an order:

```
1. CUSTOMER adds items to cart
   └──► Stored in browser (React context - "react-use-cart")

2. CUSTOMER clicks "Place Order"
   └──► Store sends POST request to backend:
        POST http://localhost:5056/v1/order/add
        Body: { cart items, shipping address, payment info }
        Header: Authorization: Bearer <token>

3. BACKEND receives the request
   └──► Express routes it to customerOrderController.js
   └──► Controller validates data, processes payment
   └──► Saves order to MongoDB (Order collection)
   └──► Updates product stock (decreases by quantity ordered)

4. BACKEND sends response back
   └──► { success: true, order: { id, invoice, total, status } }

5. STORE shows success message
   └──► "Order placed successfully! Your order ID is..."
```

---

## Important Concepts for Freshers

### What is an API?
An API is like a **menu in a restaurant**. The menu lists what you can order (endpoints), and the kitchen (backend) prepares your food (data) and brings it back.

### What is JSON?
JSON is a way to format data that both humans and computers can read:
```json
{
  "name": "Gold Necklace",
  "price": 299.99,
  "stock": 10,
  "category": "Necklaces"
}
```

### What is an Environment Variable (`.env`)?
It's a file where you store **secrets** and **settings** that are different on every computer:
- Database passwords
- API keys for payment gateways
- Which port to run on

The `.env` file is **never committed to GitHub** (protected by `.gitignore`).

### What is CORS?
Sometimes the browser says "I can't load this data because it's from a different address." CORS (set up in the backend) tells the browser "It's okay, trust this website."

---

## Common Commands Cheat Sheet

```bash
# Backend
npm run dev              # Start backend with auto-reload
npm run data:import      # Seed database with demo data
npm start                # Start without auto-reload (production)

# Store
npm run dev              # Start store on port 3000
npm run build            # Build for production
npm run start            # Run production build

# Admin
npm run dev              # Start admin on port 4100
npm run build            # Build for production
```

---

## Troubleshooting (Common Problems)

### "MongoDB connection error"
- Check your `MONGO_URI` in `.env`
- Make sure your IP is whitelisted in MongoDB Atlas (Network Access)
- Make sure your username/password is correct

### "Module not found" error
- Run `npm install` again in the folder where you got the error
- Sometimes deleting `node_modules` and `package-lock.json` then running `npm install` fixes it

### "Port already in use"
- Something else is running on that port
- Change the `PORT` in `.env` to a different number (e.g., 5057)
- Or kill the process using that port:
  ```bash
  # Find what's using port 5056
  lsof -i :5056
  # Kill it (replace PID with actual number)
  kill -9 PID
  ```

### Store shows no products / blank page
- Make sure backend is running (`npm run dev` in backend folder)
- Check that `NEXT_PUBLIC_API_BASE_URL` in store's `.env.development` matches the backend URL
- Run `npm run data:import` if no demo data was seeded

### Admin login not working
- Make sure backend is running
- Default credentials: `admin@example.com` / `123456`
- Run `npm run data:import` to seed admin accounts

### "SyntaxError: Unexpected token" errors
- You might be using a newer/older Node.js version
- Try using Node.js v18.18.2 specifically

### General debugging tips
1. **Check terminals** - Are all 3 services running? (backend, store, admin)
2. **Check the browser console** (F12 > Console tab) - Shows errors
3. **Check the backend terminal** - Shows API requests and errors
4. **Restart the backend** - Press Ctrl+C in backend terminal, then `npm run dev` again
5. **Clear cookies/localStorage** - Sometimes old auth data causes issues

---

## Need Help?

- Check the full HTML documentation at `documentation/index.html`
- Contact the project author: aislam270@gmail.com
- Report issues on GitHub/GitLab
