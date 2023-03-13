const router = require('express').Router();
const requireAuth = require('../middleware/requireAuth')
const jwt = require('jsonwebtoken')
const Post = require('../models/Post')
const User = require('../models/User')

router.get('/:id', requireAuth, async (req, res) => {
    const decodedUser = jwt.verify(req.cookies.token, process.env.JWT_SECRET)

    const loggedInUser = await User.findById(decodedUser.id)
    const post = await Post.findById(req.params.id)
    const user = await User.findById(post.author)

    res.render('post.ejs', {
        user: loggedInUser,
        author: user.username,
        image: post.image,
        likes: post.likes,
        caption: post.caption
    })
})

module.exports = router