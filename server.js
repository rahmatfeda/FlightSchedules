
var http = require('http');
var data = require('./data/data');
var app = require('./app.js').app(data);
http.createServer(app).listen(app.get('port'), function(){
	  console.log('Express server listening on port ' + app.get('port'));
	});