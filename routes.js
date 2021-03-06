function setup(app, controllers) {
    app.get('/', controllers.index);
    app.get('/admin', controllers.admin);
    app.get('/api/addNewHighscore', controllers.newHighScore);
    app.get('/api/addNewUser', controllers.newUser);
    app.get('/api/getOrCreateUserByFacebookID', controllers.getOrCreateUserByFacebookID);
    app.get('/api/getHighscores', controllers.getHighscores);
}

exports.setup = setup;