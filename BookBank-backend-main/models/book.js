const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const BookSchema = new Schema({
    owner: {type: mongoose.Schema.Types.ObjectId,ref: 'user'},
    title: { type: String, required: true },
    author: { type: String, required: true },
    availability: { type: Boolean, default: true },
    genre: { type: String },
    description: { type: String },
    coverImageUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
    condition: {type : String,required: true}
})

const BookModel = model('Books', BookSchema);
module.exports =  BookModel; 