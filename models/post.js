const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    text: String,
    completed: Boolean
});

module.exports = mongoose.model('Post', PostSchema);