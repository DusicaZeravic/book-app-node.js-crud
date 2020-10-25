const mongoose = require('mongoose');
const slugify = require('slugify');


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
    },
    slug: {
        type: String,
        required: true,
        unique: true
    }
});

bookSchema.pre('validate', function(next) {
    if(this.title) {
        this.slug = slugify(this.title, {lower: true, strict: true })
    }

    next();
});

module.exports = mongoose.model('Book', bookSchema);