const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema(
{
    title: String,
    date: String,
    content: String,
    blurb: String,
    sources: Array
});

module.exports = mongoose.model('Post', PostSchema);