const KEY = '8e4264f7-a1c1-49f3-930a-f2f1430f5e90';
const URL = 'http://bustime.mta.info/api/';

var request = require('request');
const IO = require('socket.io')();
const PORT = 8000;
IO.listen(PORT);
console.log('listening on port', PORT);

IO.on('connection', (client) => {
	console.log('connected');
	client.on('subscribeToStop', param => {
		console.log('client asked for busses going to stop ' + param.stopID + ' with interval ' + param.interval);

		setInterval(() => {
			getBussesFromStop(param.stopID);
			client.emit('returnBussesFromStop', busLocArray);
		}, param.interval);
	});
	
	client.on('subscribeToBus', param => {
		console.log('client asked for a bus ' + param.busID + ' with interval ' + param.interval);
		
		setInterval(() => {
			getBus(param.busID);
			client.emit('returnBusSingleton', busLoc);
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
function getBus(busID) {
	request(URL + 'siri/vehicle-monitoring.json?key=' + KEY + '&VehicleRef=' + busID, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			try {
				var loc = JSON.parse(body);
				busLoc.lat = loc.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity[0].MonitoredVehicleJourney.VehicleLocation.Latitude;
				busLoc.lng = loc.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity[0].MonitoredVehicleJourney.VehicleLocation.Longitude;
				console.log('getBus() set busLoc to ' + JSON.stringify(busLoc));
			} catch (err) {
				console.log('JSON was invalid from API call in getBus()!');
				console.log(err);
			}
		} else
			console.log('some form of error in getBus()');
	});
}

var busLocArray = [{lat: -1, lng: -1}];
function getBussesFromStop(stopID) {
	console.log('TODO: getBussesFromStop()');
}