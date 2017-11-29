import * as io from 'socket.io-client';
import {StopType} from './../components/BusMap';
const socket = io('http://localhost:8000');

/*
	This component serves as the middle ground between client and the server for
	retrieving real-time data from the BusTime API.
	Socket.io is used for making queries to the server and returning data to the client.

	All functions pass in a query parameter and a callback function.
*/

// DEPRICATED
// This function was supposed to get every stop that BusTime serves
// however there is no effective series of API calls to make that happen.
// 
export function getAllStops(cb: Function) {
	socket.on('returnAllStops', (kvStopArray: [number, StopType][]) => cb(null, kvStopArray));
	socket.emit('getAllStops');
}

// Pass a Bus ID and callback function receives array of Stops that the Bus visits.
export function getStopsFromBus(busID: string, cb: Function) {
	socket.on('returnStopsFromBus', (cbParam: any) => cb(null, cbParam));
	socket.emit('getStopsFromBus', busID);
}

// Pass a Stop ID and callback function receives the object for that Stop,
// which contains data such as lat/lng.
export function getStop(stopID: string, cb: Function) {
	socket.on('returnStopLocation', (cbParam: any) => cb(null, cbParam));
	socket.emit('getStop', stopID);
}

// Pass a Stop ID and interval and callback function will be called every interval seconds
// and will be passed an array of Bus objects for the Busses that visit that Stop.
export function subscribeToStop(param: any, cb: Function) {
	socket.on('returnBussesFromStop', (cbParam: any) => cb(null, cbParam));
	socket.emit('subscribeToStop', param);
}

// Pass a Bus ID  and interval and the callback function will be called every interval seconds
// and will be passed the Bus object matching that ID.
export function subscribeToBus(param: any, cb: Function) {
	socket.on('returnBusSingleton', (cbParam: any) => cb(null, cbParam));
	socket.emit('subscribeToBus', param);
}

// Makes server stop calling the passed callback functions for any of the above functions
// who's name contains 'subscribe'
export function cancelSubscriptions() {
	socket.emit('cancelSubscriptions');
}