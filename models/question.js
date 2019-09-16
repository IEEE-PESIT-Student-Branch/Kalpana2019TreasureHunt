const mongoose = require('mongoose')
const Schema = mongoose.Schema

var questionSchema = new mongoose.Schema({
    qno: Number,
    image: String,
    // question: String,
    answer: String
});



var Question = mongoose.model("question",questionSchema);
module.exports = Question;