function setup(app, controllers) {
    app.get('/', controllers.index);
    app.get('/admin', controllers.admin);
    app.get('/api/addNewHighscore', controllers.newHighScore);
    app.get('/api/addNewUser', controllers.newUser);
}

exports.setup = setup;