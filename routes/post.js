const router = require('express').Router();
const requireAuth = require('../middleware/requireAuth')
const jwt = require('jsonwebtoken')
const Post = require('../models/Post')
const User = require('../models/User')

router.get('/:id', requireAuth, async (req, res) => {
    const decodedUser = jwt.verify(req.cookies.token, process.env.JWT_SECRET)
    const loggedInUser = await User.findById(decodedUser.id)
    const post = await Post.findById(req.params.id)
    const postAuthor = await User.findById(post.author)

    res.render('post.ejs', {
        loggedInUserId: loggedInUser._id,
        loggedInUser: loggedInUser.username,
        authorName: postAuthor.username,
        image: post.image,
        likes: post.likes,
        caption: post.caption
    })
})

router.put('/:id', requireAuth, async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, { $inc: { 'likes': 1 } })
        res.status(201).send("successfully updated")
    } catch (err) {
        res.status(500).end
    }
})

router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const author = await Post.findById(req.params.id)
        const post = await Post.findByIdAndRemove(req.params.id)

        res.status(201).json(author.author)
    } catch (err) {
        res.status(500).end
    }
})

module.exports = router