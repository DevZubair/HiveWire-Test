var express = require('express'),
    router    = express.Router();

module.exports = function (app) {
    app.use('/admin', router);
};

router.get('/newUsers', function (req, res, next) {
    res.sendfile('web-portal/newUsers.html');

});
