if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')

const indexRouter = require('./routes/index')
const authorsRouter = require('./routes/authors')
const booksRouter = require('./routes/books')


app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit:'10mb', extended: false }))
//app.use(bodyParser.json())


const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL) //, {useNewUrlParser: true}
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to mongoose'))



app.use('/', indexRouter)
app.use('/authors', authorsRouter)
app.use('/books', booksRouter)


app.listen(process.env.PORT || 3000)

