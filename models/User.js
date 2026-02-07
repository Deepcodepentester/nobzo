const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name:{
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      index: true,
      required: true,
    },
    password:{
      type: String,
      //select: false,
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
