import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8000');

function getStop(stopID, cb) {
	socket.on('stopLocation', (cbParam) => cb(null, cbParam));
	socket.emit('getStop', stopID);
}

function subscribeToStop(interval, cb) {
	socket.on('timer', (cbParam) => cb(null, cbParam));
	socket.emit('subscribeToStop', interval);
}

function subscribeToBus(param, cb) {
	socket.on('busTimer', (cbParam) => cb(null, cbParam));
	socket.emit('subscribeToBus', param);
}

export {getStop, subscribeToStop, subscribeToBus}