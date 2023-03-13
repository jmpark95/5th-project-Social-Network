const jwt = require('jsonwebtoken')

function requireAuth(req, res, next) {
    const token = req.cookies.token

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.redirect('/')
            } else {
                next()
            }
        })
    } else {
        res.redirect('/')
    }
}

module.exports = requireAuth