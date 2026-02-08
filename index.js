const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("./models/User");
const authRouter = require("./auth")
const auth = require("./middleware/auth")
const optionalauth = require("./middleware/optionalAuth")
const posts = require("./controllers/postcontroller")
const isAuthor= require("./middleware/isauthor")
const cookieParser= require("cookie-parser")
require("dotenv").config()
const app = express();
//app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())


//connect to mongodb database
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

app.use('/api/auth',authRouter);

  app.post('/posts',auth,posts.createPost)
  //app.get('/posts',auth,posts.getPublicPosts)
  app.get("/posts/:slug",auth, posts.getPostBySlug);
  app.put("/posts/:id", auth, isAuthor, posts.updatePost);
  app.delete("/posts/:id", auth, isAuthor, posts.deletePost);
  app.get('/posts',optionalauth,posts.getPosts)

  

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server running on port 5000");
  });

