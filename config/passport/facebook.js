var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('../config');


module.exports = (app, passport) => {
    return new FacebookStrategy({
        clientID: config.facebook.clientID,
        clientSecret: config.facebook.clientSecret,
        callbackURL: config.facebook.callbackURL
    }, (accessToken, refreshToken, profile, done) => {
        console.log('passport의 facebook 호출됨.');
        console.dir(profile);


        var options = {
            criteria: {'facebook.id': profile.id}
        }

        var database = app.get('database');
        database.userModel.load(options, (err, user) => {
            if(err) return done(err);

            if(!user) {
                var user = new database.userModel({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    provider: 'facebook',
                    facebook: profile._json
                })


                user.save((err) => {
                    if(err) console.log(err);

                    return done(err, user);
                })
            } else {
                return done(err, user);
            }
        })
    })
}