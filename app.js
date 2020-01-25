
exports.app = function(data){
	var express = require('express'),
	   flightRecords = require('./routes/flightRecords'); 
	
	var app = express();
	app.all('*', function(req, res, next) {
	    if (!req.get('Origin')) return next();
	    // use "*" here to accept any origin
	    res.set('Access-Control-Allow-Origin', '*');
	    res.set('Access-Control-Allow-Methods', 'GET');
	    res.set('Access-Control-Allow-Headers', 'Accept-Encoding,X-Requested-With, Content-Type');
	    res.connection.setNoDelay(true);

	    next();
	});
	// all environments
	app.set('port', process.env.PORT || 3000);
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	flightRecords.init(data);
	//app.get('/', routes.index);
	app.get('/flights/:number', flightRecords.getDetails);
	app.get('/total', flightRecords.getCount);
	app.put('/flights/arrived/:number', flightRecords.arrived);
	app.put('/flights/departed/:number', flightRecords.departed);
	return app;
	
};

