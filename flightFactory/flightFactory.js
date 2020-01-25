
var Flight = function(){
	this.flightData = {
			flightNumber : null,
			origin : null,
			destination : null,
			arrives : null,
			departs : null,
			scheuledArrival : null,
			scheduledDeparture : null
	};

	
	this.populate = function(inputData){
		for( var detail in this.flightData){
			if(inputData[detail] !== 'undefined'){
				this.flightData[detail] = inputData[detail];
			}
		}
	};
	
	this.departed = function(){
		this.flightData.scheduledDeparture = new Date(Date.now()).toString();
	};
	
	this.arrived = function(){
		this.flightData.scheuledArrival = new Date(Date.now()).toString();
	};
};

var flightInstanceCount = 0;
exports.createInstance = function(data){
	var flightInstance = new Flight();
	flightInstance.populate(data);
	flightInstanceCount++;
	return flightInstance;
	
};
exports.getFlightInstanceCount = function(){
	return flightInstanceCount;
};