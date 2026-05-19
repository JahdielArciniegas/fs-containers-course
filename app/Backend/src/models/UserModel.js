import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        default: '',
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 20,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trime: true,
        minlength: 6,
        maxlength: 254,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 254,
    },
    isAdmin: {
        type: Boolean,
        default: false,
        required: true,
    },
})

export default mongoose.model('User', UserSchema)
