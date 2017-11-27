import * as io from 'socket.io-client';
import {StopType} from './../components/BusMap';
const socket = io('http://localhost:8000');

export function getAllStops(cb: Function) {
	socket.on('returnAllStops', (kvStopArray: [number, StopType][]) => cb(null, kvStopArray));
	socket.emit('getAllStops');
}

export function getStopsFromBus(busID: string, cb: Function) {
	socket.on('returnStopsFromBus', (cbParam: any) => cb(null, cbParam));
	socket.emit('getStopsFromBus', busID);
}

export function getStop(stopID: string, cb: Function) {
	socket.on('returnStopLocation', (cbParam: any) => cb(null, cbParam));
	socket.emit('getStop', stopID);
}

export function subscribeToStop(param: any, cb: Function) {
	socket.on('returnBussesFromStop', (cbParam: any) => cb(null, cbParam));
	socket.emit('subscribeToStop', param);
}

export function subscribeToBus(param: any, cb: Function) {
	socket.on('returnBusSingleton', (cbParam: any) => cb(null, cbParam));
	socket.emit('subscribeToBus', param);
}

export function cancelSubscriptions() {
	socket.emit('cancelSubscriptions');
}