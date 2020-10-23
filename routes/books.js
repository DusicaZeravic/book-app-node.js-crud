const express = require('express');
const Book = require('./../models/model');
const router = express.Router();

router.get('/new', (req, res) => {
    res.render('books/new', { book: new Book() });
});

router.get('/:id', async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (book == null) res.redirect('/')
    res.render('books/book', { book: book });
});

router.post('/', async (req, res) => {
    let book = new Book({
        title: req.body.title,
        author: req.body.author,
        pages: req.body.pages,
        isbn: req.body.isbn,
        description: req.body.description
    })
    try {
        book = await book.save();
        res.redirect('/list');
    } catch (e) {
        res.render('books/new', { book: book })
    }
});

module.exports = router;