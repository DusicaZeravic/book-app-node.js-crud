const express = require('express');
const mongoose = require('mongoose');
const Book = require('./models/model');
const bookRouter = require('./routes/books');
const bodyParser = require('body-parser');
const { route } = require('./routes/books');
var app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/bookDB', {
    useNewUrlParser: true, useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log('Error occured while connection to MongoDB', err));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// Connect with styles
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views/img'));


app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('books/main');
})

app.get('/list', async (req, res) => {
    const books = await Book.find();
    res.render('books/list', { books: books });
});

app.use('/books', bookRouter);
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));