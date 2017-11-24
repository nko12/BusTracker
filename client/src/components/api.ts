import * as io from 'socket.io-client';
import {StopType} from './BusMap';
const socket = io('http://localhost:8000');

function getAllStops(cb: Function) {
	socket.on('returnAllStops', (kvStopArray: [number, StopType][]) => cb(null, kvStopArray));
	socket.emit('getAllStops');
}

function getStopsFromBus(busID: string, cb: Function) {
	socket.on('returnStopsFromBus', (cbParam: any) => cb(null, cbParam));
	socket.emit('getStopsFromBus', busID);
}

function getStop(stopID: string, cb: Function) {
	socket.on('returnStopLocation', (cbParam: any) => cb(null, cbParam));
	socket.emit('getStop', stopID);
}

function subscribeToStop(param: any, cb: Function) {
	socket.on('returnBussesFromStop', (cbParam: any) => {
		console.log(JSON.stringify(cbParam));
		cb(null, cbParam)
	});
	socket.emit('subscribeToStop', param);
}

function subscribeToBus(param: any, cb: Function) {
	socket.on('returnBusSingleton', (cbParam: any) => cb(null, cbParam));
	socket.emit('subscribeToBus', param);
}

export {getStop, getAllStops, getStopsFromBus, subscribeToStop, subscribeToBus};