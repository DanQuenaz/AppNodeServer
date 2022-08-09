module.exports = app => {

    app.route('/')
        .get(function(req, res) {
            res.send('<h1>Opa</h1>');
          });
    
    app.route('/signup')
        .post(app.api.user.new_user);

    app.route('/signin')
        .post(app.api.auth.signin);

    app.route('/sheets')
        .all(app.config.passport.authenticate())
        .post(app.api.sheets.new_sheet)
        .get(app.api.sheets.get_sheets)
        .patch(app.api.sheets.add_user_sheet)
        .put(app.api.sheets.rename_sheet)
        .delete(app.api.sheets.del_sheet);
    
    app.route('/spends')
        .all(app.config.passport.authenticate())
        .get(app.api.spends.get)
        .put(app.api.spends.put);
    
    app.route('/tags')
        .all(app.config.passport.authenticate())
        .get(app.api.spends.get)
        .put(app.api.spends.put);


};