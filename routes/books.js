const express = require('express');
const Book = require('./../models/model');
const router = express.Router();

router.get('/new', (req, res) => {
    res.render('books/new', { book: new Book() });
});

router.get('/edit/:id', async (req, res) => {
    const book = await Book.findById(req.params.id);
    res.render('books/edit', { book: book });
});

router.get('/:slug', async (req, res) => {
    const book = await Book.findOne({ slug: req.params.slug });
    if (book == null) res.redirect('/')
    res.render('books/book', { book: book });
});

// Handling the post request
router.post('/', async (req, res, next) => {
    req.book = new Book();
    next();
}, postOrEditBook('new'));

// Handling the update request
router.put('/:id', async (req, res, next) => {
    req.book = await Book.findById(req.params.id);
    next();
}, postOrEditBook('edit'));

// Handling the delete request
router.delete('/:id', async (req, res) => {
    await Book.findByIdAndDelete(req.params.id);
    res.redirect('/list');
});

// Shared function between post and update request
function postOrEditBook(path) {
    return async (req, res) => {
        let book = req.book;
        book.title = req.body.title;
        book.author = req.body.author;
        book.pages = req.body.pages;
        book.isbn = req.body.isbn;
        book.description = req.body.description;
        try {
            book = await book.save();
            if(path == 'new') {
                res.redirect('/list');
            } else {
                res.redirect(`/books/${book.slug}`);
            }
        } catch (e) {
            res.render(`articles/${path}`, { book: book })
        }
    }
}

module.exports = router;