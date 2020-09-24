const passport = require("../config/passport");

module.exports = (app, router, passport) => {
    console.log('user_passport 호출됨');

    router.route('/').get((req, res) => {
        console.log('/ 패스 요청됨');
        res.render('index.ejs');
    });
    
    router.route('/login').get((req, res) => {
        console.log('/login 패스 요청됨');
        res.render('login.ejs', {message: req.flash('loginMessage')});
    });
    
    router.route('/login').post(passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));
    
    router.route('/signup').get((req, res) => {
        console.log('/signup 패스 요청됨 ');
        res.render('signup.ejs', {message: req.flash('signupMessage')});
    });
    
    router.route('/signup').post(passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }));
    
    
    
    router.route('/profile').get(function(req, res) {
        console.log('/profile 패스 요청됨');
    
        console.log('req.user 객체의 값');
        console.log(req.user);
    
        if(!req.user) {
            console.log('사용자 인증이 안 된 상태');
            res.redirect('/');
            return;
        }
    
        console.log('사용자 인증된 상태');
        if(Array.isArray(req.user)) {
            res.render('profile.ejs', {user: req.user[0]._doc});
        } else {
            res.render('profile.ejs', {user: req.user});
        }
    });
    
    router.route('/logout').get((req, res) => {
        console.log('/logout 패스 요청됨');
        req.logout();
        res.redirect('/');
    });


    router.route('/auth/facebook').get(passport.authenticate('facebook', {
        scope: 'email'
    }));


    router.route('/auth/facebook/callback').get(passport.authenticate('facebook', {
        successRedirect: '/profile',
        failureRedirect: '/'
    }));
}