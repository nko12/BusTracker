/* api key:   8e4264f7-a1c1-49f3-930a-f2f1430f5e90    */

var request = require('request');
const io = require('socket.io')();

/*request('http://bustime.mta.info/api/siri/stop-monitoring.json?key=8e4264f7-a1c1-49f3-930a-f2f1430f5e90&MonitoringRef=308214', function (error, response, body) {
			if (!error && response.statusCode == 200) {
				try {
						var stops = JSON.parse(body);
						console.log(stops.Siri.ServiceDelivery.StopMonitoringDelivery[0].MonitoredStopVisit);
					
				}
				catch (err) {
					console.log(err);
				}
			}
			
		});*/

io.on('connection', (client) => {
	console.log('connected');
	client.on('subscribeToTimer', interval => {
		console.log('client is subscribing to timer with interval', interval);

		foo(interval);

		setInterval(() => {
			client.emit('timer', locationWrappers);
		}, interval);
	});
	
	client.on('subscribeToBus', param => {
		console.log('client asked for a bus');
		
		setInterval(() => {
			getBus(param.interval, param.ID);
			client.emit('busTimer', busLoc);
		}, param.interval);
	
	});
});

var busLoc = {lat: 0, lng: 0};

function getBus(interval, busID) {
	

	var url = 'http://bustime.mta.info/api/siri/vehicle-monitoring.json?key=8e4264f7-a1c1-49f3-930a-f2f1430f5e90&VehicleRef=';
	
	setInterval(() => {
		request(url + busID, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				try {
					var loc = JSON.parse(body);
					console.log(loc.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity[0].MonitoredVehicleJourney.VehicleLocation);
					busLoc.lat = loc.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity[0].MonitoredVehicleJourney.VehicleLocation.Latitude;
					busLoc.lng = loc.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity[0].MonitoredVehicleJourney.VehicleLocation.Longitude;
				}
				catch (err) {
					console.log('JSON was invalid from API call!');
				}
			}
			
		});
	}, interval);
	
}

var locationWrappers = [{lat: -1, lng: -1}];

function foo(interval) {
	setInterval(() => {
		request('http://api.prod.obanyc.com/api/siri/vehicle-monitoring.json?key=8e4264f7-a1c1-49f3-930a-f2f1430f5e90', function (error, response, body) {
			if (!error && response.statusCode == 200) {
				try {
					var loc = JSON.parse(body);
					locationWrappers = [];
					for (var i = 0; i < 10; i++) {
						location = loc.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity[i].MonitoredVehicleJourney.VehicleLocation;
						
						var locationWrapper = {
							lat: location.Latitude,
							lng: location.Longitude
						};
						console.log(JSON.stringify(locationWrapper));
						locationWrappers.push(locationWrapper);
					}
				}
				catch (err) {
					console.log('JSON was invalid from API call!');
				}
			}
			
		});
	}, interval);
}

const port = 8000;
io.listen(port);
console.log('listening on port', port);