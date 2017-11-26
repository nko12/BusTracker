import {User} from './models/User';
import {BusTrackerApi} from './api/BusTrackerApi';
import {Coords} from 'google-map-react';

/**
 * Represents the shape of the BusTracker Application's state.
 */
export interface BusTrackerAppState {
	user: User;
	api: BusTrackerApi;
	location: Coords;
}

// Represents the initial state of the app on startup.
export let appState: BusTrackerAppState = {
	user: null,
	api: new BusTrackerApi(),
	location: {lat: 40.7588528, lng: -73.9852625}
}