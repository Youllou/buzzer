const buzzer = require("../models/Buzzer.model");

exports.create = (req, res)=>{
    console.log('create')
    // make a 6 digit random number
    let id = Math.floor(100000 + Math.random() * 900000);
    console.log(id);
    // create a new buzzer
    let newBuzzer = new buzzer({
        id: id,
        players: [],
    });
    // save the buzzer
    newBuzzer.save().then(function(result) {
        res.send(result);
    }).catch((err) => {
        console.log(err);
        res.status(500).send(err);
    });

}