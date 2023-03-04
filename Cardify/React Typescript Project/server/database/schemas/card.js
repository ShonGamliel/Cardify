const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema({
    cardid: {
        type: Number,
        required: true,
    },
    userid: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    whatsapp: {
        type: String,
        required: true,
    },
    website: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    images: {
        type: Array,
        required: true,
    },
});

module.exports = mongoose.model("cards", CardSchema);
