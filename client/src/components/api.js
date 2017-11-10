import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8000');

function subscribeToTimer(interval, cb) {
	socket.on('timer', (cbParam) => cb(null, cbParam));
	socket.emit('subscribeToTimer', interval);
}

function subscribeToBus(param, cb) {
	socket.on('busTimer', (cbParam) => cb(null, cbParam));
	socket.emit('subscribeToBus', param);
}

export {subscribeToTimer, subscribeToBus}