const express = require('express');
const path = require('path');
const ngApp = express();
ngApp.use(express.static('./dist/web-random-order'));
ngApp.get('/*', function (request, response) {
    response.sendFile(path.join(__dirname, '/dist/web-random-order/index.html'));
});
ngApp.listen(process.env.PORT || 8080);