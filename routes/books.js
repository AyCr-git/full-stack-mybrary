const express = require('express')
const router = express.Router()

const Book = require('../models/book')
const Author = require('../models/author')
const imageMimeType = ['image/jpeg', 'image/png']


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

//Show Book
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
                                .populate('author')
                                .exec()

        res.render('books/show', {
            book: book
        })
    } catch  {
        res.redirect('/')
    }
    
})

//Edit Book View
router.get('/:id/edit', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
        renderEditPage(res, book)
    } catch (error) {
        res.redirect('/')
    }
})

//Create Book Route
router.post('/', async (req, res) => {
    const book = new Book({
        title: req.body.title,
        description: req.body.description,
        pageCount: req.body.pageCount,
        publishDate: new Date(req.body.publishDate),
        author: req.body.author
    })

    const cover = JSON.parse(req.body.cover)
    saveCover(book, req.body.cover)

    try {
        const newBook = await book.save()
        //res.redirect(`books/${newBook.id}`)
        res.redirect(`books`)
    } catch (error) {
        // if (book.coverImageName != null) {
        //     removeBookCover(book.coverImageName)
        // }
        console.error(error)
        renderNewPage(res, book, true)
    }
})

//Update Book Route
router.put('/:id', async (req, res) => {
    let book 

    try {
        book = await Book.findById(req.params.id)
        book.title = req.body.title
        book.description = req.body.description
        book.pageCount = req.body.pageCount
        book.publishDate = new Date(req.body.publishDate)
        book.author = req.body.author
        
        if (req.body.cover != null && req.body.cover !== '') {
            saveCover(book, req.body.cover)
        }
        
        await book.save()
        res.redirect(`/books/${book.id}`)
    } catch (error) {

        console.error(error)
        if (book != null) {
            renderEditPage(res, book, true)
        }else {
            res.render('/')
        }
    }
})

router.delete('/:id', async (req, res) => {
    
    try {
        const book = await Book.findById(req.params.id)
        await book.deleteOne()
        res.redirect(`/books`)
    } catch (error) {
        res.render('/')
    }
})

function saveCover(book, coverEncoded) {
    if (coverEncoded == null) return 
    const cover = JSON.parse(coverEncoded)
    console.log('saveCover')
    if (cover != null && imageMimeType.includes(cover.type)) {
        console.log(cover.type)
        book.coverImage = new Buffer.from(cover.data, 'base64')
        book.coverImageType = cover.type
    }
}

// function removeBookCover(fileName) {
//     fs.unlink(path.join(uploadPath, fileName), err => {
//         if(err) console.error(err)
//     })
// }

async function renderNewPage(res, book, hasError = false) {
    renderFormPage(res, book, "new", hasError)
}

async function renderEditPage(res, book, hasError = false) {
    renderFormPage(res, book, "edit", hasError)
}

async function renderFormPage(res, book, form, hasError = false) {
    try {
        const authors = await Author.find({})
        const params = {
            authors: authors,
            book, book
        }
        if (hasError) {
            if (form === "edit") {
                params.errorMessage = 'Failed to update book'
            }else {
                params.errorMessage = 'Failed to create new book'
            }
        }

        res.render(`books/${form}`, params)

    } catch {
        res.redirect('/books')
    }
}


module.exports = router