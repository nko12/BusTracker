/* api key:   8e4264f7-a1c1-49f3-930a-f2f1430f5e90    */

var request = require('request');
const io = require('socket.io')();

io.on('connection', (client) => {
	console.log('connected');
	client.on('subscribeToTimer', interval => {
		console.log('client is subscribing to timer with interval', interval);

		foo(interval);

		setInterval(() => {
			client.emit('timer', locationWrappers);
		}, interval);
	});
});

var locationWrappers = [{lat: -1, lng: -1}];

function foo(interval) {
	setInterval(() => {
		request('http://api.prod.obanyc.com/api/siri/vehicle-monitoring.json?key=8e4264f7-a1c1-49f3-930a-f2f1430f5e90', function (error, response, body) {
			if (!error && response.statusCode == 200) {
				//console.log(body) // Print the google web page.
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
				//console.log(locationWrapper);
				console.log(location_view);
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