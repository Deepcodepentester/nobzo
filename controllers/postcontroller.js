// controllers/post.controller.js
const Post = require("../models/Post");
const User = require("../models/User");



exports.createPost = async (req, res) => {
  //const { title, content, published } = req.body;
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({error:"All fields are required"})
    
}
const { title,content,status } = req.body;

if (!title || !content || !status ) {
    return res.status(400).json({error:"All fields are required"});
}
  //title,content,author
  email = req.user.email
  //res.status(201).json("post");

  
    const user = await User.findOne({ email:email });
      if (!user) {
        return res.status(401).json({ message: "unauthorized" });
      }
      //res.status(201).json(user);
      const existingUser = await Post.findOne({ title:email });
      if (!existingUser) {
        //return res.status(401).json({ message: "failed unauthorized" });
      }

  const post = await Post.create({
    title,
    content,
    author: user.id,
    status
  });

  res.status(201).json(post);
};



exports.getPublicPosts = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
  
    const posts = await Post.find({
      status: 'published',
      deletedAt: null,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("title", "content");
  
    const total = await Post.countDocuments({
      published: true,
      deletedAt: null,
    });
  
    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      total,
      posts,
    });
  };
  
