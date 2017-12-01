import {User} from './models/User';
import {BusTrackerApi} from './api/BusTrackerApi';
import {Coords} from 'google-map-react';

/**
 * Represents the shape of the BusTracker Application's state.
 */
export interface BusTrackerAppState {
	/**
	 * The user object which contains various user data.
	 */
	user: User;
	/**
	 * The BusTrackerApi object to use to communicate with the BusTracker server.
	 */
	api: BusTrackerApi;
	/**
	 * The current location of the user.
	 */
	location: Coords;
}

// Represents the initial state of the app on startup.
export let appState: BusTrackerAppState = {
	user: null,
	api: new BusTrackerApi(),
	location: {lat: 40.7588528, lng: -73.9852625}
}