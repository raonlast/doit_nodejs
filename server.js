var express = require('express'),
    http = require('http'),
    path = require('path');

var bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    static = require('serve-static'),
    errorHandler = require('errorhandler'),
    mongoose = require('mongoose');

var crypto = require('crypto');

var expressErrorHandler = require('express-error-handler');

var expressSession = require('express-session');

var passport = require('passport');
var flash = require('connect-flash');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname +'/css'));



app.use(cookieParser());

app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));



var route_leader = require('./routes/route_loader');
route_leader.init(app, express.Router());


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
console.log('뷰 엔진이 ejs로 설정되었습니다.');


var user = require('./routes/user');


var errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

var database;

function createUserSchema(database) {
    
    database.userSchema = require('./database/user_schema').createSchema(mongoose);

    database.userModel = mongoose.model("users", database.userSchema);
    console.log('userModel 정의함');
    
    // user.init(database, database.userSchema, database.userModel);
}
var database = require('./database/database'); 

var config = require('./config');


app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var LocalStrategy = require('passport-local').Strategy;

passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
    console.log('passport의 local-login 호출됨 : ' + email + ', ' + password);

    var database = app.get('database');
    database.userModel.findOne({'email': email}, function(err, user) {
        if(err) {return done(err);}

        if(!user) {
            console.log('계정이 일치하지 않음');
            return done(null, false, req.flash('loginMessage', '등록된 계정이 없습니다.'));
        }

        var authenticated = user.authenticate(password, user._doc.salt, user._doc.hashed_password);
        if(!authenticated) {
            console.log('비밀번호 일치하지 않음');
            return done(null, false, req.flash('loginMessage', '비밀번호가 일치하지 않습니다.'));
        }

        console.log('계정과 비밀번호 일치함');
        return done(null, user);
    })
}));

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    var paramName = req.body.name || req.query.name;
    console.log('passport의 local-signup 호출됨 : ' + email + ', ' + password + ', ' + paramName);

    process.nextTick(function() {
        var database = app.get('database');
        database.userModel.findOne({'email': email}, function(err, user) {
            if(err) {
                return done(err);
            }

            if(user) {
                console.log('기존에 계정이 있음');
                return done(null, false, req.flash('signupMessage', '계정이 이미 있습니다.'));
            } else {

                var user = new database.userModel({'email': email, 'password': password, 'name': paramName});

                user.save(function(err) {
                    if(err) {throw err;}
                    console.log('사용자 데이터 추가함');
                    return done(null, user);
                });
            }
        });
    });
}));

passport.serializeUser(function(user, done) {
    console.log('serializeUser 호출됨');
    console.dir(user);

    done(null, user);
});

passport.deserializeUser(function(user, done) {
    console.log('deserializeUser 호출됨');
    console.dir(user);

    done(null, user);
});


console.log('config.server_port : %d', config.server_port);
app.set('port', process.env.PORT || config.server_port);
// const hostname = '172.30.1.47';

app.listen(app.get('port'), () => {
    console.log('server has started : ' + app.get('port'));
    // console.log(__dirname);

    database.init(app, config);
}); 

 