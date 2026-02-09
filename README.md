# 📝 Blog Posts API

A production-ready REST API for managing blog posts, built with **Node.js**, **Express**, **MongoDB**, and **JWT authentication**.

This project demonstrates clean backend architecture, secure authentication, authorization, pagination, filtering, and soft deletion — patterns commonly used in real-world applications.

---

## 🚀 Features

- JWT-based authentication
- Public and protected routes
- Author-only update and delete permissions
- Draft and published post support
- Soft delete (data is never permanently removed)
- Pagination with metadata
- Advanced filtering and search
- MongoDB full-text search (title & content)

---

## 🧰 Tech Stack

- **Node.js**
- **Express**
- **MongoDB + Mongoose**
- **JSON Web Tokens (JWT)**
- **dotenv**

---

## 📁 Project Structure

```

Nobzo/
│
├── controllers/
│ └── postcontroller.js
│
├── models/
│ ├── Post.js
│ └── User.js
│
├── routes/
│ └── post.routes.js
│
├── middleware/
│ ├── auth.js
│ └── isAuthor.js
│
├── index.js

```


---

## 🔐 Authentication

Authentication is handled using **JWT tokens** which is included in http only cookie which is added after login.

Create a .env file and copy all from .env.example into it :

JWT_SECRET
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/nobzo

RUn npm install 
RUn node index.js

import New Collection.postman_collection on postman and run


## About the endpoints
POST /api/auth/register 
POST /api/auth/login 

 POST - Create post (auth required) 
/posts  
● GET - Public posts (published only) with pagination 
/posts  
● GET - Get single published post 
/posts/:slug  
● PUT - Update post (author only) 
/posts/:id  
● DELETE - Soft delete (author only) 
/posts/:id 

Filtering  
GET /api/posts support filtering in the query parameters e.g: GET /api/posts?page=2&limit=5&search=node
● page, limit 
● search (title or content) 
● tag 
● author 
● status (authenticated users only) 
