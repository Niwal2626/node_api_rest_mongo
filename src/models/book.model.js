const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: String,
    autor: String,
    genre: String,
    publication_date: Date
});

module.exports =mongoose.model('Book',bookSchema);