/* api key:   8e4264f7-a1c1-49f3-930a-f2f1430f5e90    */

var request = require('request');
const io = require('socket.io')();

io.on('connection', (client) => {
	console.log('connected');
	client.on('subscribeToTimer', interval => {
		console.log('client is subscribing to timer with interval', interval);

		foo(interval);

		setInterval(() => {
			client.emit('timer', location);
		}, interval);
	});
});

var location = 'request not finished yet';
var i = 0;

function foo(interval) {
	setInterval(() => {
		request('http://api.prod.obanyc.com/api/siri/vehicle-monitoring.json?key=8e4264f7-a1c1-49f3-930a-f2f1430f5e90&MaximumStopVisits=1', function (error, response, body) {
			if (!error && response.statusCode == 200) {
				//console.log(body) // Print the google web page.
			}
			var loc = JSON.parse(body);
			
			location = JSON.stringify(loc.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity[0].MonitoredVehicleJourney.VehicleLocation);
			console.log(location);
		});
	}, interval);
}

const port = 8000;
io.listen(port);
console.log('listening on port', port);