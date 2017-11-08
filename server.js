/* api key:   8e4264f7-a1c1-49f3-930a-f2f1430f5e90    */

var request = require('request');
const io = require('socket.io');
const port = 8000;

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

setInterval(function() {
request('http://api.prod.obanyc.com/api/siri/vehicle-monitoring.json?key=8e4264f7-a1c1-49f3-930a-f2f1430f5e90&MaximumStopVisits=1', function (error, response, body) {
  if (!error && response.statusCode == 200) {
   //console.log(body) // Print the google web page.
  }
  var loc = JSON.parse(body);
  /*console.log(loc.Siri.ServiceDelivery.StopMonitoringDelivery[0].MonitoredStopVisit[0].MonitoredVehicleJourney.VehicleLocation);*/

for (var i = 0; i < 3; i++)
console.log(loc.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity[i].MonitoredVehicleJourney.VehicleLocation);
console.log('\n');
})
}, 6000);

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(port, function(){
  console.log('listening on *:8000');
});

