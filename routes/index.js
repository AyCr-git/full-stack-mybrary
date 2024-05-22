const express = require('express')
const router = express.Router()
const Book = require('../models/book')


router.get('/', async (req, res)=> {
    try {
        let query = Book.find().sort({ createDate: 'desc'}).limit(10)

        const books = await query.exec()
        res.render('index', {
            books: books
        })
    } catch {
        res.send('Something wents wrong!')
    }
})


module.exports = router