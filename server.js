var express = require('express'),
    morgan  = require('morgan'),
    app     = express(),
    port    = process.env.PORT || 8008;

// log every request to the console
app.use(morgan('dev'));

// static files
app.use('/uploaded', express.static(__dirname + '/uploaded'));
app.use('/webapp', express.static(__dirname + '/webapp'));

// routes
require('./api/routes.js')(app);

// run
app.listen(port);
console.log('Server started on port ' + port);