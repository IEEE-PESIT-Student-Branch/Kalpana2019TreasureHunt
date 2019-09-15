const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Result Schema
const ResultSchema = new Schema({
    username: String,
    //qno: number
    score: Number,
})




var Result = mongoose.model("result",ResultSchema);
module.exports = Result;