const buzzer = require("../models/Buzzer.model");

exports.createPlayer = function(req, res) {
    let name = req.body.name;
    let id = req.params.id;
    if (id==='undefined') {
        res.status(404).send({message:'id is undefined'});
        return
    }
    buzzer.findOne({id: id}).then((result) => {
        if (result.players.find((player) => player.name === name)) {
            res.status(400).send({message:'name already exists'});
        }else{
            let newPlayer ={
                name: name,
                locked: false,
                score: 0,
                buzzed: false
            };
            result.players.push(newPlayer);
            result.save().then(function(result) {
                res.status(200).send({name: name,roomID: id});
            }).catch((err) => {
                console.log(err);
                res.status(500).send(err);
            });
        }
    }).catch((err) => {
        console.log(err)
        res.status(404).send(err);
    });
}

exports.getPlayers = function(req, res) {
    let id = req.params.id;
    if (id==='undefined') {
        res.status(404).send({message:'id is undefined'});
        return
    }
    buzzer.findOne({id: id}).then((result) => {
        res.send(result.players);
    }).catch((err) => {
        res.status(404).send(err);
    });
}

exports.deleteOnePlayer = function(req, res) {
    let name = req.params.name;
    let id = req.params.id;
    if (id==='undefined') {
        res.status(404).send({message:'id is undefined'});
        return
    }
    buzzer.findOne({id: id}).then((result) => {
        if (result.players.find((player) => player.name === name)) {
            result.players = result.players.filter((player) => player.name !== name);
            result.save().then(function(result) {
                res.send(result.players);
            }).catch((err) => {
                res.status(500).send(err);
            });
        }else{
            res.status(404).send({message:'name not found'});
        }
    }).catch((err) => {
        res.status(404).send(err);
    });
}

exports.buzzPlayer = function(req, res) {
    let id = req.params.id;
    if (id==='undefined') {
        res.status(404).send({message:'id is undefined'});
        return
    }
    let name = req.body.name;
    buzzer.findOne({id: id}).then((result) => {
        if(result.players.find((player) => player.name === name && player.buzzed)){
            res.status(400).send({message:'name already buzzed'});
            return
        }
        result.players.find((player) => player.name === name).buzzed = true;
        result.save().then(function(result) {
            res.status(200).send(result.players.filter((player) => player.buzzed));
        }).catch((err) => {
            res.status(500).send(err);
        });
    }).catch((err) => {
        res.status(404).send(err);
    });

}

exports.resetAllBuzzed = function(req, res) {
    let id = req.params.id;
    if (id==='undefined') {
        res.status(404).send({message:'id is undefined'});
        return
    }
    buzzer.findOne({id: id}).then((result) => {
        for (let player of result.players) {
            player.buzzed = false
        }
        result.save().then(function(result) {
            res.status(200).send(result);
        }).catch((err) => {
            res.status(500).send(err);
        });
    }).catch((err) => {
        res.status(404).send(err);
    });
}

exports.resetOneBuzzed= function (req,res){
    let id = req.params.id;
    if (id==='undefined') {
        res.status(404).send({message:'id is undefined'});
        return
    }
    let name = req.params.name;
    buzzer.findOne({id: id}).then((result) => {
        result.players.find((player) => player.name === name).buzzed = false;
        result.save().then(function(result) {
            res.status(200).send(result);
        }).catch((err) => {
            res.status(500).send(err);
        });
    }).catch((err) => {
        res.status(404).send(err);
    });
}

exports.lockOnePlayer = function(req, res) {
    let id = req.params.id;
    if (id==='undefined') {
        res.status(404).send({message:'id is undefined'});
        return
    }
    let name = req.params.name;
    let locked = req.body.locked;
    buzzer.findOne({id: id}).then((result) => {
        result.players.find((player) => player.name === name).locked = locked;
        result.save().then(function(result) {
            res.status(200).send(result);
        }).catch((err) => {
            res.status(500).send(err);
        });
    }).catch((err) => {
        res.status(404).send(err);
    });
}

exports.lockAllPlayer = function(req, res) {
    let id = req.params.id;
    if (id==='undefined') {
        res.status(404).send({message:'id is undefined'});
        return;
    }
    let locked = req.body.locked;
    buzzer.findOne({id: id}).then((result) => {
        for (let player of result.players) {
            player.locked = locked;
        }
        result.save().then(function(result) {
            res.status(200).send(result);
        }).catch((err) => {
            res.status(500).send(err);
        });
    }).catch((err) => {
        res.status(404).send(err);
    });
}

exports.score = function(req, res) {
    let id = req.params.id;
    if (id==='undefined') {
        res.status(404).send({message:'id is undefined'});
        return
    }
    let name = req.body.name;
    let score = req.body.score;
    buzzer.findOne({id: id}).then((result) => {
        result.players.find((player) => player.name === name).score += score;
        result.save().then(function(result) {
            res.status(200).send(result);
        }).catch((err) => {
            res.status(500).send(err);
        });
    }).catch((err) => {
        console.log(err);
        res.status(404).send(err);
    });
}