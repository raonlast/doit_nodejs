var mongoose = require('mongoose');

var database = {};

database.init = function(app, config) {
    console.log('init() 호출됨');

    connect(app, config);
}

function connect(app, config) {
    console.log('connect() 호출됨');

    mongoose.Promise = global.Promise;
    mongoose.connect(config.db_url);
    database.db = mongoose.connection;

    database.db.on('error', console.error.bind(console, 'mongoose connection error'));
    database.db.on('open', function() {
        console.log('데이터베이스에 연결되었습니다 : ' + config.db_url);

        createSchema(app, config);
    });
    database.db.on('disconnected', connect);
}


function createSchema(app, config) {
    var schemaLength = config.db_schemas.length;
    console.log('설정에 정의된 스키마의 수 : %d', schemaLength);

    for (var i = 0; i < schemaLength; i++) {
        var curItem = config.db_schemas[i];

        var curSchema = require(curItem.file).createSchema(mongoose);
        console.log('%s 모듈을 불러들인 후 스키마 정의함', curItem.file);

        var curModel = mongoose.model(curItem.collection, curSchema);
        console.log('%s 컬렉션을 위해 모델 정의함', curItem.collection);

        database[curItem.schemaName] = curSchema;
        database[curItem.modelName] = curModel;
        console.log('스키마 이름[%s], 모델 이름[%s]이 database 객체의 속성으로 추가됨.',
            curItem.schemaName, curItem.modelName);
    }

    app.set('database', database);
    console.log('database 객체가 app 객체의 속성으로 추가됨.');
}


module.exports = database;