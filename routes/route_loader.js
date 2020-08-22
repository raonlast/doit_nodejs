var route_loader = {};

var config = require('../config');


route_loader.init = (app, router) => {
    console.log('route_loader.init 호출됨');
    return initRoutes(app, router);
}

function initRoutes(app, router) {

    var infoLen = config.route_info.length;
    console.log('설정에 정의된 라우팅 모듈의 수 : %d', infoLen);

    for (var i = 0; i < infoLen; i++) {
        var curItem = config.route_info[i];
        
        var curModele = require(curItem.file);
        console.log('%s 파일에서 모듈정보를 읽어옴', curItem.file);

        if (curItem.type == 'get') {
            router.route(curItem.path).get(curModele[curItem.method]);
        } else if (curItem.type == 'post') {
            router.route(curItem.path).post(curModele[curItem.method]);
        } else {
            router.route(curItem.path).post(curModele[curItem.method]);
        }


        console.log('라우팅 모듈 [%s]이 설정됨.', curItem.method);
    }

    app.use('/', router);
}

module.exports = route_loader;