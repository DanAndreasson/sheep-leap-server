var pg = require('pg');
var conString = "postgres://dan:loppan@web441.webfaction.com:5432/sheep_leap";


exports.fetchOrCreateUserByFacebookID = function(name, facebook_id, callback){
    pg.connect(conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('INSERT INTO users (name, facebook_id) ' +
            'SELECT  $1::text, $2::text ' +
            'WHERE NOT EXISTS (SELECT facebook_id FROM users WHERE facebook_id = $2::text)',[name, facebook_id] ,function(err, result) {

            //call `done()` to release the client back to the pool
            done();

            if(err) {
                return console.error('error running query', err);
            }
            var newlyCreated = result.rows.length == 0;
            fetchUserData(facebook_id, newlyCreated, callback);
            return null;
        });
        return null;
    });
};
var fetchUserData;
exports.fetchUserData = fetchUserData = function(facebook_id, newlycreated, callback){
    pg.connect(conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        var query = 'SELECT u.id, u.name, MAX(h.score) as score ' +
            'FROM users u, highscores h ' +
            'WHERE h.user_id = u.id AND u.facebook_id = $1::text ' +
            'GROUP BY u.id' ;

        if (newlycreated){
            query = 'SELECT u.id, u.name ' +
                'FROM users u ' +
                'WHERE u.facebook_id = $1::text';
        }

        client.query(query,[facebook_id],function(err, result) {

            //call `done()` to release the client back to the pool
            done();

            if(err) {
                return console.error('error running query', err);
            }
            console.log(result);
            callback(err, result.rows[0]);
            return null;
        });
        return null;
    });
};

exports.insertUser = function(name, facebook_id, google_id, callback){
    pg.connect(conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('INSERT INTO users (name, facebook_id) VALUES ($1::text, $2::text)',[name, facebook_id] ,function(err, result) {

            //call `done()` to release the client back to the pool
            done();

            if(err) {
                return console.error('error running query', err);
            }
            callback(err, result);
            return null;
        });
        return null;
    });
};

exports.fetchCurrentHighscore = function(callback){
    pg.connect(conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT MAX(score) as score FROM highscores',function(err, result) {

            //call `done()` to release the client back to the pool
            done();

            if(err) {
                return console.error('error running query', err);
            }
            callback(err, result);
            return null;
        });
        return null;
    });
};


exports.insertHighScore = function(user_id, score ,callback){
    pg.connect(conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('INSERT INTO highscores (user_id, score) ' +
            'VALUES ($1::int, $2::int)', [user_id, score],function(err, result) {

                //call `done()` to release the client back to the pool
                done();

                if(err) {
                    return console.error('error running query', err);
                }
                callback(err, result);
                return null;
            });
        return null;
    });
};


exports.fetchHighScores = function(quantity ,callback){
    pg.connect(conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT max(h.score) as score, u.name, u.id FROM users u ' +
            'JOIN highscores h ON h.user_id = u.id ' +
            'GROUP BY u.id ' +
            'ORDER BY max(h.score) DESC ' +
            'LIMIT $1::int',
            [10], function(err, result) {

            //call `done()` to release the client back to the pool
            done();

            if(err) {
                return console.error('error running query', err);
            }
            callback(err, result);
            return null;
        });
        return null;
    });
};
