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

var flash = require('connect-flash');


var passport = require('passport');

var facebook = require('./config/passport/facebook');
facebook(app, passport);

var database = require('./database/database'); 

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname +'/css'));

app.use('/public', express.static(path.join(__dirname, 'public')));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
console.log('뷰 엔진이 ejs로 설정되었습니다.');

app.use(cookieParser());

app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));


app.use(flash());
app.use(passport.initialize());
app.use(passport.session());



// var database;

// function createUserSchema(database) {
    
//     database.userSchema = require('./database/user_schema').createSchema(mongoose);
    
//     database.userModel = mongoose.model("users", database.userSchema);
//     console.log('userModel 정의함');
    
//     // user.init(database, database.userSchema, database.userModel);
// }




var config = require('./config/config');

var router_leader = require('./routes/route_loader');

var router = express.Router();

router_leader.init(app, router);





// import passport from 'passport';
// import passportConfig from './config/passport';



var passportConfig = require('./config/passport');

// require('./routes/user_passport')(app, router, passport);



passportConfig(app, passport);




// var route_leader = require('./routes/route_loader');
// route_leader.init(app, router);


var userPassport = require('./routes/user_passport');
userPassport(app, router, passport);






app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

var errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});





console.log('config.server_port : %d', config.server_port);
app.set('port', process.env.PORT || 3000);
// const hostname = '172.30.1.47';

var server = app.listen('3000', () => {
    console.log('server has started : ' + app.get('port'));
    console.log(__dirname);

    database.init(app, config);
}); 
    
 