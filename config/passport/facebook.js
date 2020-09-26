var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('../config');
var User = require('../../database/database');


module.exports = (app, passport) => {
    return new FacebookStrategy({
        clientID: config.facebook.clientID,
        clientSecret: config.facebook.clientSecret,
        callbackURL: config.facebook.callbackURL,
        profileFields: ['id', 'email', 'displayName'] 
    }, (accessToken, refreshToken, profile, done) => {
        console.log('passport의 facebook 호출됨.');
        console.dir(profile);


        var options = {
            facebook: {'facebook': profile.id}
        }
        
        
        var database = app.get('database');
        database.userModel.findOne(options, (err, user) => {
            if(err) return done(err);
        
        // User.findOne(options, (err, user) => {
        //     if(err) return done(err);


            if(user) {
                return done(err, user)
            }

            var user = new database.userModel({
                name: profile.displayName,
                // email: profile.emails.value,
                provider: 'facebook',
                facebook: profile._json,
                authToken: accessToken
            })


            user.save((user) => {
                return done(null, user);
            });
        })





            

        //     if(!user) {
                var user = new database.userModel({
                    name: profile.displayName,
                    // email: profile.emails.value,
                    provider: 'facebook',
                    facebook: profile._json,
                    authToken: accessToken
                })


        //         user.save((err) => {
        //             if(err) console.log(err);

        //             return done(err, user);
        //         })
        //     } else {
        //         return done(err, user);
        //     }
        // })
    })
}