const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    books : [
        {
            status: { type: String, required: true },
            id: { type: Schema.Types.ObjectId, ref: 'book', required: true }
        }
    ]
})

const UserModel = model('Users', UserSchema);
module.exports = UserModel; 