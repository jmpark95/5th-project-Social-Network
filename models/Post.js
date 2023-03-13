const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel" },
    image: String,
    caption: String,
    likes: Number,
    cloudinaryId: String,
    createdAt: { type: Date, default: Date.now }
})

const PostModel = mongoose.model("Post", PostSchema)

module.exports = PostModel