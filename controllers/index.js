var db = require("../database");

global.currentHighscore = -1;

exports.index = function (req, res) {
    var highscores = [];
    var quan_highscores = 100;
    db.fetchHighScores(quan_highscores, function (err, result) {
        if (!err) {
            highscores = result.rows;
        }
        res.render('index', { title: 'Express', highscores: highscores });
    });

};

exports.getHighscores = function(req, res){
    var highscores = [];
    var quan_highscores = req.query.quantity;
    db.fetchHighScores(quan_highscores, function (err, result) {
        if (!err) {
            highscores = result.rows;
        }
        res.json({highscores: highscores });
    });
};

exports.admin = function (req, res) {
    res.render('admin', { title: 'Express' });
};

exports.getOrCreateUserByFacebookID = function (req, res) {
    var facebook_id = req.query.facebookID;
    var name = req.query.name;
    var user_id = 32;
    var score = -1;
    db.fetchOrCreateUserByFacebookID(name, facebook_id, function(err, result){
        user_id = result.id;
        if (result.score != undefined)
            score = result.score;
        res.json({"userID": user_id, "highestScore": score});
    });

};

exports.newHighScore = function (req, res) {
    var user_id = req.query.user_id;
    var score = req.query.score;
    db.insertHighScore(user_id, score, function (err, result) {
        var world_record = isNewHighscore(score);
        res.json({"success": !err, "world record": world_record});
    });
};

exports.newUser = function (req, res) {
    var name = req.query.name;
    var facebook_id = req.query.facebookid;
    var google_id = -1;
    console.log("name: " + name + ". Facebook_ID: " + facebook_id);
    db.insertUser(name, facebook_id, google_id, function (err, result) {
        res.json({"success": !err});
    });
};

var isNewHighscore = function (score) {
    if (global.currentHighscore == -1) {
        db.fetchCurrentHighscore(function (err, result) {
            if (!err) {
                global.currentHighscore = result.rows[0].score;
                if (score > global.currentHighscore) {
                    console.log("WE HAVE A NEW CHAMPION!!");
                    global.currentHighscore = score;
                    return true;
                }
            }
            return false;
        });
    }
    if (score > global.currentHighscore) {
        global.currentHighscore = score;
        return true;
    }
    return false;

};





