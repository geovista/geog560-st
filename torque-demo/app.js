// dependencies
var express = require('express'),
	http = require('http'),
	path = require('path');

var routes = require('./routes');

// Configure Settings
var app = express();
app.set('appName', 'wrld-time');
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// Middleware Jazz
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', routes.main);
app.all('*', function (req, res) {
	res.redirect('/');
});


// Make and Start Server
var server = http.createServer(app);

server.listen(app.get('port'), function () {
	console.log('Express server listening on port ' + app.get('port'));
});
