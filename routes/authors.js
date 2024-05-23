const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')

//All Authors Route
router.get('/', async (req, res) => {

    const searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }

    try {
        const authors = await Author.find(searchOptions)
        res.render('authors/index', { 
            authors: authors,
            searchOptions: req.query
        })
    
    } catch (error) {
        res.redirect("/")
    }
})

//New Author Route
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author() })
})

//Create Author Route
router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name
    })

    try {
        const newAuthor = await author.save()
        res.redirect(`authors/${newAuthor.id}`)
    } catch (error) {
        res.render('authors/new',  {
            author: author,
            errorMessage: 'Error creating author'
        })
    }
})


//Show Author
router.get('/:id', async (req, res) => {
    let author 
    try {
        author = await Author.findById(req.params.id)
        const books = await Book.find({ author: req.params.id }).limit(10).exec()
        res.render('authors/show', {
            author: author,
            books: books
        })
    } catch  {
        if (author == null) {
            res.redirect('/')
        }else {
            console.error(error)
            res.redirect(`/authors/${author.id}`)
        }
    }
    
})

//Edit Author View
router.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', { author: author })
    } catch (error) {
        res.redirect('/authors')
    }
})

//Update Author in Database
router.put('/:id', async (req, res) => {
    let author

    try {
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect(`/authors/${author.id}`)
    } catch (error) {
        if (author == null) {
            res.redirect('/')
        }else {
            res.render(`authors/edit`,  {
                author: author,
                errorMessage: 'Error updating author'
            })
        }
    }
})

//Delete author
router.delete('/:id', async (req, res) => {
    let author

    try {
        author = await Author.findById(req.params.id)
        await author.deleteOne()
        res.redirect('/authors')
    } catch (error) {
        if (author == null) {
            res.redirect('/')
        }else {
            console.error(error)
            res.redirect(`/authors/${author.id}`)
        }
    }
})


module.exports = router