// middleware/isAuthor.js
const Post = require("./models/Post");

module.exports = async (req, res, next) => {
    const email =req.user
  const post = await Post.findById(req.params.id);

  if (!post || post.deletedAt) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (post.author.toString() !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  req.post = post;
  next();
};
