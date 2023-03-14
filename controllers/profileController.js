const User = require('../models/User')
const Post = require("../models/Post")
const jwt = require('jsonwebtoken')
const cloudinary = require("../middleware/cloudinary");

module.exports.profile_get = async (req, res) => {
    try {
        const decodedUser = jwt.verify(req.cookies.token, process.env.JWT_SECRET)

        if (decodedUser.id === req.params.id) {
            const loggedInUser = await User.findById(req.params.id)

            const posts = await Post.find({ author: loggedInUser._id })

            res.render('profile.ejs', { loggedInUserId: loggedInUser._id, loggedInUser: loggedInUser.username, posts })
        } else {
            res.status(403).redirect('/')
        }
    } catch (err) {
        res.status(500).send(err)
    }
}

module.exports.createpost_post = async (req, res) => {
    try {
        const decodedUser = jwt.verify(req.cookies.token, process.env.JWT_SECRET)
        const result = await cloudinary.uploader.upload(req.file.path);

        await Post.create({
            author: decodedUser.id,
            image: result.secure_url,
            caption: req.body.caption,
            likes: 0,
            cloudinaryId: result.public_id,
        });

        res.redirect(`/profile/${decodedUser.id}`);
    } catch (err) {
        res.status(500).end()
    }
}