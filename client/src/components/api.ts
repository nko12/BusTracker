import * as io from 'socket.io-client';
import {StopType} from './BusMap';
const socket = io('http://localhost:8000');

var getAllStops = (cb: Function) => {
	socket.on('returnAllStops', (kvStopArray: [number, StopType][]) => cb(null, kvStopArray));
	socket.emit('getAllStops');
}

var getStopsFromBus = (busID: string, cb: Function) => {
	socket.on('returnStopsFromBus', (cbParam: any) => cb(null, cbParam));
	socket.emit('getStopsFromBus');
}

var getStop = (stopID: string, cb: Function) => {
	socket.on('returnStopLocation', (cbParam: any) => cb(null, cbParam));
	socket.emit('getStop', stopID);
}

var subscribeToStop = (param: any, cb: Function) => {
	socket.on('returnBussesFromStop', (cbParam: any) => cb(null, cbParam));
	socket.emit('subscribeToStop', param);
}

var subscribeToBus = (param: any, cb: Function) => {
	socket.on('returnBusSingleton', (cbParam: any) => cb(null, cbParam));
	socket.emit('subscribeToBus', param);
}

export {getStop, getAllStops, getStopsFromBus, subscribeToStop, subscribeToBus}