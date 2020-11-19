const express = require('express');
const Book = require('./../models/model');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const router = express.Router();

var storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({ storage: storage });

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
router.post('/', upload.single('image'), async (req, res, next) => {
    req.book = new Book();
    next();
}, postOrEditBook('new'));

// Handling the update request
router.put('/:id', upload.single('image'), async (req, res, next) => {
    req.book = await Book.findById(req.params.id);
    next();
}, postOrEditBook('edit'));

// Handling the delete request
router.delete('/:id', async (req, res) => {
    await Book.findByIdAndDelete(req.params.id);
    res.redirect('/list');
});

// Shared function between post and update request
function postOrEditBook(page) {
     return async (req, res) => {
         if(req.file) {
            var bitmap = fs.readFileSync(path.join('./public/uploads/' + req.file.filename));
            var encImage = Buffer.from(bitmap).toString('base64');
           let book = req.book;
           book.title = req.body.title;
           book.author = req.body.author;
           book.pages = req.body.pages;
           book.isbn = req.body.isbn;
           book.description = req.body.description;
           book.img = {
               data: encImage,
               contentType: 'image/png'
           }
           try {
               book = await book.save();
               if (page == 'new') {
                   res.redirect('/list');
               } else {
                   res.redirect(`/books/${book.slug}`);
               }
           } catch (error) {
               console.log(error);
               res.render(`books/${page}`, { book: book })
           }
         } else {
             console.log('Error!');
         }
    }
    
}

module.exports = router;