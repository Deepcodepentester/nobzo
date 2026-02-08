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
      status: "published",
      deletedAt: null,
    });
  
    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      total,
      posts,
    });
  };
  


  exports.getPostBySlug = async (req, res) => {
    const post = await Post.findOne({
      slug: req.params.slug,
      status: "published",
      deletedAt: null,
    }).populate("author", "name");
  
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
  
    res.json(post);
  };


  exports.updatePost = async (req, res) => {
    const { title, content, status } = req.body;
  
    if (title) {
      req.post.title = title;
      /* req.post.slug = title
        .toLowerCase()
        .replace(/[^\w ]+/g, "")
        .replace(/ +/g, "-"); */
    }
  
    if (content !== undefined) req.post.content = content;
    if (status !== undefined) req.post.status = status;
  
    await req.post.save();
    return res.json(req.post);
  };

  exports.deletePost = async (req, res) => {
    req.post.deletedAt = new Date();
    await req.post.save();
  
    res.json({ message: "Post deleted successfully" });
  };


  exports.getPosts = async (req, res) => {
    const {
      page = 1,
      limit = 10,
      search,
      tag,
      author,
      status,
    } = req.query;
  
    const filters = {
      deletedAt: null,
    };
  
    // 🔐 Public vs authenticated visibility
    if (req.user) {
        email = req.user.email
  //res.status(201).json("post");

  
    const user = await User.findOne({ email:email });
      if (!user) {
        return res.status(401).json({ message: "unauthorized" });
      }
        if (status === "draft") {
            /* return res.json({
                page: user.id,
              }); */
            filters.$and = [
                {author: user.id},
                { status: "draft" }
              ];
        }
        else{
            filters.$or = [
                { status: 'public' },
                { author: req.user.id },
              ]
        }
        /* if (status) {
            filters.status = status;
            filters.$and.push({
                status,
                author: req.user.id,
              });
              filters.$and = [
                {author: req.user.id},  
                { $or: [ {$and:[]},{ status: "draft" }, { joinYear: 2021 } ] },
                { content: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
              ];
            
        } */
      
    } else{
        filters.status = "published";
    }
    /* else if (status) {
        filters.status = status;
      if (status === "published") filters.published = true;
      if (status === "draft") filters.published = false;
    } */
  
    // 🔍 Search (title + content)
    if (search) {
        filters.$or = [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
        ];
    }  
  
    // 🏷️ Tag filter
    if (tag) {
      filters.tags = tag;
    }
  
    // ✍️ Author filter
    if (author) {
      filters.author = author;
    }
  
    const skip = (page - 1) * limit;
  
    const posts = await Post.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("author", "name");
  
    const total = await Post.countDocuments(filters);
  
    return res.json({
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
      posts,
    });
  };
  
  
