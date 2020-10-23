const mongoose = require('mongoose');


const bookSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    author: {
        required: true,
        type: String
    },
    pages: {
        required: true,
        type: Number
    },
    isbn: {
        type: String
    },
    description: {
        required: true,
        type: String
    }
});

module.exports = mongoose.model('Book', bookSchema);