const KEY = '8e4264f7-a1c1-49f3-930a-f2f1430f5e90';
const URL = 'http://bustime.mta.info/api/';

var request = require('request');
const IO = require('socket.io')();
const PORT = 8000;
IO.listen(PORT);
console.log('listening on port', PORT);

var bus_active = false;
var stop_active = false;

var numClicks = 0;
var clickLimit = 5;

var stopInfoArray = [{code: 00000, name: 'RoadA/RoadB', lat: 0, lng: 0}];

function getStopInfo() {
	request('http://bustime.mta.info/api/where/stops-for-location.json?lat=40.748433&lon=-73.985656&latSpan=10&lonSpan=10&key=8e4264f7-a1c1-49f3-930a-f2f1430f5e90', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			try {
				var loc = JSON.parse(body);
				for (var i = 0; i < loc.data.stops.length; i++) {
					var stopInfoObject = {code: 00000, name: 'RoadA/RoadB', lat: 0, lng: 0};
					stopInfoObject.code = loc.data.stops[i].code;
					stopInfoObject.name = loc.data.stops[i].name;
					stopInfoObject.lat = loc.data.stops[i].lat;
					stopInfoObject.lng = loc.data.stops[i].lon;
					stopInfoArray[i] = stopInfoObject;
				}
				console.log(JSON.stringify(stopInfoArray));
			} catch (err) {
				console.log('JSON was invalid from API call in getStopInfo()!');
				console.log(err);
			}
		} else
			console.log('some form of error in getStopInfo');
	});
	
}

IO.on('connection', (client) => {
	console.log('connected');
	client.on('subscribeToStop', param => {
		bus_active = false;
		stop_active = true;
		console.log('client asked for busses going to stop ' + param.stopID + ' with interval ' + param.interval);

		// pseudo-do-while loop
		if (numClicks < clickLimit)
			getBussesFromStop(param.stopID, client);
		var stopTimer = setInterval(() => {
			if (stop_active == false)
				clearInterval(stopTimer);
			getBussesFromStop(param.stopID, client);
			numClicks = 0;
		}, param.interval);
	});
	
	var busTimer = undefined;
	client.on('subscribeToBus', param => {
		bus_active = true;
		stop_active = false;
		console.log('client asked for a bus ' + param.busID + ' with interval ' + param.interval);
		
		// end old interval, if there is one
		if (busTimer != undefined)
			clearInterval(busTimer);

		// pseudo-do-while loop
		if (numClicks < clickLimit)
			getBus(param.busID, client);
		busTimer = setInterval(() => {
			if (bus_active == false)
				clearInterval(busTimer);
			getBus(param.busID, client);
			numClicks = 0;
		}, param.interval);
	
	});
	
	client.on('getStop', stopID => {
		console.log('client asked for lat/lng of stop ' + stopID);
		getStop(stopID, client);
	});
});

function getStop(stopID, client) {
	request(URL + 'where/stop/MTA_' + stopID + '.json?key=' + KEY, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			try {
				var loc = JSON.parse(body);
				var ret = {lat: loc.data.lat, lng: loc.data.lon};
				console.log('getStop() emitting ' + JSON.stringify(ret));
				client.emit('returnStopLocation', ret);
			} catch (err) {
				console.log('JSON was invalid from API call in getStop()!');
				console.log(err);
			}
		} else
			console.log('some form of error in getStop()');
	});
}

var busLoc = {lat: 0, lng: 0};
function getBus(busID, client) {
	request(URL + 'siri/vehicle-monitoring.json?key=' + KEY + '&VehicleRef=' + busID, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			try {
				var loc = JSON.parse(body);
				busLoc.lat = loc.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity[0].MonitoredVehicleJourney.VehicleLocation.Latitude;
				busLoc.lng = loc.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity[0].MonitoredVehicleJourney.VehicleLocation.Longitude;
				console.log('getBus() set busLoc to ' + JSON.stringify(busLoc));
				if (bus_active == true)
					client.emit('returnBusSingleton', busLoc);
			} catch (err) {
				console.log('JSON was invalid from API call in getBus()!');
				console.log(err);
			}
		} else
			console.log('some form of error in getBus()');
	});
}

var busLocArray = [{location: {lat: 0, lng: 0}, ID: 'nil'}];
function getBussesFromStop(stopID, client) {
	request(URL + 'siri/stop-monitoring.json?key=' + KEY + '&MonitoringRef=' + stopID, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			try {
				var loc = JSON.parse(body);
				var numBusses = loc.Siri.ServiceDelivery.StopMonitoringDelivery[0].MonitoredStopVisit.length;
				for (var i = 0; i < numBusses; i++) {
					var thisBusLoc = {location: {lat: 0, lng: 0}, ID: 'nil'};
					thisBusLoc.location.lat = loc.Siri.ServiceDelivery.StopMonitoringDelivery[0].MonitoredStopVisit[i].MonitoredVehicleJourney.VehicleLocation.Latitude;
					thisBusLoc.location.lng = loc.Siri.ServiceDelivery.StopMonitoringDelivery[0].MonitoredStopVisit[i].MonitoredVehicleJourney.VehicleLocation.Longitude;
					thisBusLoc.ID = loc.Siri.ServiceDelivery.StopMonitoringDelivery[0].MonitoredStopVisit[i].MonitoredVehicleJourney.VehicleRef;
					busLocArray[i] = thisBusLoc;
					console.log('getBussesFromStop() setting busLocArray[' + i + '] to ' + JSON.stringify(thisBusLoc));
				}
				if (stop_active == true)
					client.emit('returnBussesFromStop', busLocArray);
			} catch (err) {
				console.log('JSON was invalid from API call in getBus()!');
				console.log(err);
			}
		} else
			console.log('some form of error in getBus()');
	});
}

var stopLocArray = [{location: {lat: 0, lng: 0}, ID: 'nil'}];
function getStopsFromBus(busID, client) {
	console.log('TODO: getStopsFromBus()');
}