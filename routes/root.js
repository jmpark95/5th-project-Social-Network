const router = require('express').Router();
const authController = require('../controllers/authController');
const requireAuth = require('../middleware/requireAuth');
const jwt = require('jsonwebtoken')
const Post = require('../models/Post')
const User = require('../models/User')

router.get('/', (req, res) => {
    res.render("home.ejs")
})

router.get('/login', authController.login_get)
router.get('/signup', authController.signup_get)
router.post('/login', authController.login_post)
router.post('/signup', authController.signup_post)

router.get('/feed', requireAuth, async (req, res) => {
    const decodedUser = jwt.verify(req.cookies.token, process.env.JWT_SECRET)
    const user = await User.findById(decodedUser.id)
    const allPosts = await Post.find({})
    res.render('feed.ejs', { allPosts, user })
})

router.get('/logout', (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
})

module.exports = router
