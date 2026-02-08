// middleware/isAuthor.js
const Post = require("../models/Post");
const User = require("../models/User");

module.exports = async (req, res, next) => {
    //return res.status(200).send(req.user)
    const email =req.user.email
    const existingUser = await User.findOne({ email:email });
  console.log(existingUser)
  if (!existingUser) {
    return res.status(401).json({ message: "error occured" });
  }
  const post = await Post.findById(req.params.id);

  if (!post || post.deletedAt) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (post.author.toString() !== existingUser.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  req.post = post;
  next();
};
