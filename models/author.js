const mongoose = require('mongoose')
const Book = require('./book')


const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})


authorSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    return Book.find( { author: this.id })
        .then(function(books) {
            if (books.length > 0) {
                next(new Error('Author has books'))
            }else {
                next()
            }
        })
})

module.exports = mongoose.model('Author', authorSchema)