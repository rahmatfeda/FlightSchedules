var flightRecords = {};
var flightFactory ;

function statusCode404(message){
	var response = {
			status: 404,
			reponse: message
	};
	return response;
}

function sendResponse(res, status, message){
	res.status(status);
	res.json(message);
}

function isDBEmpty(res, number){
	if(Object.keys(flightRecords).length === 0){
		var message = statusCode404('Database is empty');
		sendResponse(res, 404, message);
		return true;
	}
	
	return false;
}

function isFlightValid(res, number){
	if(typeof flightRecords[number] === 'undefined'){
		var message = statusCode404('Invalid flight number');
		sendResponse(res, 404, message);
		return true;
	}
	return false;
}

exports.getDetails = function(req, res){
	var message = null;
	var number = req.param('number');
	if(!isDBEmpty(res, number)){
		if(!isFlightValid(res, number)){
			message = flightRecords[number];
			sendResponse(res, 200, message);
		}
	}
};

exports.init = function(data) {
	flightFactory = require('../flightFactory');
	for(var key in data){
		flightRecords[key] = flightFactory.createInstance(data[key]);
	}
};

exports.getCount = function(req, res){
	var response = {
			total:flightFactory.getFlightInstanceCount()
	};
	res.send(response);

};

exports.arrived = function(req, res){
	var number = req.param('number');
	if(!isDBEmpty(res, number)){
		if(!isFlightValid(res, number)){
			var flightObj = flightRecords[number];
			flightObj.arrived();
			sendResponse(res, 200, 'Flight status updated');
		}
	}
};

exports.departed = function(req, res){
	var number = req.param('number');
	if(!isDBEmpty(res, number)){
		if(!isFlightValid(res, number)){
			var flightObj = flightRecords[number];
			flightObj.departed();
			sendResponse(res, 200, 'Flight status updated');
		}
	}
};