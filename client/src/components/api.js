import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8000');

function getStop(stopID, cb) {
	socket.on('returnStopLocation', (cbParam) => cb(null, cbParam));
	socket.emit('getStop', stopID);
}

function subscribeToStop(param, cb) {
	socket.on('returnBussesFromStop', (cbParam) => cb(null, cbParam));
	socket.emit('subscribeToStop', param);
}

function subscribeToBus(param, cb) {
	socket.on('returnBusSingleton', (cbParam) => cb(null, cbParam));
	socket.emit('subscribeToBus', param);
}

export {getStop, subscribeToStop, subscribeToBus}