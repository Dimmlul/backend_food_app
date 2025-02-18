const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    otp: {type: String, required: false, default: "none"},
    password: {type: String, required: true},
    verification: {type: Boolean, default: false},
    phone: {type: String, default: "0123456789"},
    phoneVerification: {type: Boolean, default: false},
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: false,
    },
    userType: {type: String, required: true, default: "Client", enum: ['Client', 'Admin', 'Vendor', 'Driver']},
    profile: {type: String, default: 'https://i.pinimg.com/736x/55/0f/49/550f49a459548599a5a4ea1c67fc0244.jpg'}
}, {timestamps: true});

module.exports = mongoose.model('User', UserSchema);