const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("./models/User");
const authRouter = require("./auth")
const auth = require("./middleware/auth")
const posts = require("./controllers/postcontroller")
const cookieParser= require("cookie-parser")
const birds = require('./birds')
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

const users = 
    { id: 1, username: "test", password: bcrypt.hashSync("1234", 10) }
    /* app.get('/api', (req,res)=>{
        return res.status(200).send(req.cookies)
    }) */

    app.post("/mongodb/users", async (req, res) => {
        try {
            const user = await User.create(req.body);
            res.status(201).json(user);
          } catch (err) {
            res.status(400).json({ error: err.message });
          }
        //res.json(req.user)
      })
  

app.get('/test',(req,res)=>{
    //jwt.sign()
    const signed = jwt.sign(users, process.env.JWT_SECRET, { expiresIn: "15m" })
    return res.status(200).send(signed)
})


app.get('/auth',(req,res)=>{
    return res.status(200).send(req.cookies)
})


app.post('/auth',(req,res)=>{
    return res.status(200).send(req.cookies)
})

app.post('/auth',(req,res)=>{
    return res.status(200).send(req.cookies)
})


app.post('/auth',(req,res)=>{
    return res.status(200).send(req.cookies)
})



app.post('/auth',(req,res)=>{
    return res.status(200).send(req.cookies)
})

app.use('/api/auth',authRouter);





  app.use('api/birds', birds)

  app.post('/posts',auth,posts.createPost)
  app.get('/posts',auth,posts.getPublicPosts)

  

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server running on port 5000");
  });

