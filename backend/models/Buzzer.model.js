let mongoose = require('mongoose')

let buzzerSchema = new mongoose.Schema({
    id: String,
    players: [{
        name: String,
        locked: Boolean,
        score: Number,
        buzzed: Boolean
    }],
});
let buzzer = mongoose.model('buzzer', buzzerSchema);

module.exports = buzzer;