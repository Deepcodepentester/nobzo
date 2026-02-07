const express = require("express");;
const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcrypt");
const cookieParser= require("cookie-parser");
const jwt = require("jsonwebtoken");
const router = express.Router()
require("dotenv").config()

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(cookieParser())

//connect to mongodb database
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

  
  const users = 
  { id: 1, username: "test", password: bcrypt.hashSync("1234", 10) }
router.get('/test',(req,res)=>{
    //jwt.sign()
    const signed = jwt.sign(users, process.env.JWT_SECRET, { expiresIn: "15m" })
    return res.status(200).send(signed)
})

/* router.post("/register", (req, res) => {
    const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json("All fields required" );
  }

  //const hashedPassword = await bcrypt.hash(password, 10);

  return res.status(200).send(req.body)
}) */

router.post("/register", async(req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(401).json({error:"All fields are required"})
        
    }
    const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({error:"All fields are required"});
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email:email });
  console.log(existingUser)
  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }
  const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });
        return res.status(201).json({message:"User registered successfully" });
      } catch (err) {
        res.status(400).json({ error: "Server error" });
      }

  

  //return res.status(200).send(req.body)
})

router.post("/login", async (req, res) => {

    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({error:"All fields are required"})
        
    }
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({error:"All fields are required"});
    }
    const user = await User.findOne({ email:email });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Compare password
      console.log(user)
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Create JWT
      const token = jwt.sign( { email: email },process.env.JWT_SECRET || "secretkey",{ expiresIn: "1h" });
        res.cookie("accessToken", token, {httpOnly: true,sameSite: "strict"})
        return res.status(200).json({ token: token ,
        success:true,message:"Login successful"});
    ///////////////
    
  });

module.exports = router
