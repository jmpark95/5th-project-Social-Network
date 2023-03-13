const User = require('../models/User')
const jwt = require('jsonwebtoken')

//error messages for the frontend
function handleErrors(err) {
    const errorObject = { email: '', username: '', password: '' }
    //duplicate email
    if (err.code === 11000 && err.keyValue.email) {
        errorObject.email = "That email is already registered"
        return errorObject
    }
    //duplicate username
    if (err.code === 11000 && err.keyValue.username) {
        errorObject.username = "That username already exists"
        return errorObject
    }
    //incorrect email
    if (err.message === "Incorrect email") {
        errorObject.email = 'Email not registered'
    }
    //incorrect password
    if (err.message === "Incorrect password") {
        errorObject.password = 'Incorrect password'
    }
    //validation error
    if (err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(error => {
            errorObject[error.properties.path] = error.properties.message
        })
    }

    return errorObject
}

module.exports.login_get = (req, res) => {
    res.render('login.ejs')
}

module.exports.signup_get = (req, res) => {
    res.render('signup.ejs')
}

module.exports.signup_post = async (req, res) => {
    const { email, username, password } = req.body

    try {
        const newUser = await User.create({ email, username, password })
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "24h" })
        res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
        res.status(201).json({ user: newUser._id })
    } catch (err) {
        const errorObject = handleErrors(err)
        res.status(400).json({ errorObject })
    }
}

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.login(email, password)
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" })
        res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
        res.status(200).json({ user: user._id })
    } catch (err) {
        const errorObject = handleErrors(err)
        res.status(400).json({ errorObject })
    }
}