require('dotenv').config()
const express = require("express")
const app = express()
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

const rootRouter = require('./routes/root')
const profileRouter = require('./routes/profile')
const postRouter = require('./routes/post')

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to database")
        app.listen(3000)
        console.log(`App listening on port 3000`)
    })
    .catch(err => console.log(err));

app.set("view-engine", "ejs")
app.use(express.static("public"));
app.use(express.json())
app.use(cookieParser())

app.use('/', rootRouter)
app.use('/profile', profileRouter)
app.use('/post', postRouter)