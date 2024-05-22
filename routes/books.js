const express = require('express')
const router = express.Router()
const multer = require('multer')
const fs = require('fs')
const path = require('path')

const Book = require('../models/book')
const Author = require('../models/author')
const uploadPath = path.join('public', Book.coverImageBasePath)
const imageMimeType = ['image/jpeg', 'image/png']

const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeType.includes(file.mimetype))
    }
})

//All Book Route
router.get('/', async (req, res) => {
    try {
        let query = Book.find()
        if (req.query.title != null && req.query.title !== '') {
            query = query.regex('title', new RegExp(req.query.title, 'i'))
        }

        if (req.query.publishedBefore != null && req.query.publishedBefore !== '') {
            query = query.lte('publishDate', req.query.publishedBefore)
        }
        if (req.query.publishedAfter != null && req.query.publishedAfter !== '') {
            query = query.gte('publishDate', req.query.publishedAfter)
        }

        const books = await query.exec()
            res.render('books/index', {
            books: books,
            searchOptions: req.query
        })
    } catch (error) {
        
    }
})

//New Book Route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book())
})

//Create Book Route
router.post('/', upload.single('cover'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null

    const book = new Book({
        title: req.body.title,
        description: req.body.description,
        pageCount: req.body.pageCount,
        publishDate: new Date(req.body.publishDate),
        coverImageName: fileName,
        author: req.body.author
    })

    try {
        const newBook = await book.save()
        //res.redirect(`books/${newBook.id}`)
        res.redirect(`books`)
    } catch (error) {
        if (book.coverImageName != null) {
            removeBookCover(book.coverImageName)
        }
        renderNewPage(res, book, true)
    }
})


function removeBookCover(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if(err) console.error(err)
    })
}

async function renderNewPage(res, book, hasError = false) {
    try {
        const authors = await Author.find({})
        const params = {
            authors: authors,
            book, book
        }
        if (hasError) params.errorMessage = 'Failed to create new book'

        res.render('books/new', params)

    } catch {
        res.redirect('/books')
    }
}

module.exports = router