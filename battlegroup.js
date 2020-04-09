const mongoose = require("mongoose");
module.exports = mongoose.model("Battlegroup", mongoose.Schema({
    userId: mongoose.ObjectId,
    name: String,
    total: Number,
    list: Array
}, {timestamps: true}));