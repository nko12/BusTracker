import {User} from './models/User';
import {BusTrackerApi} from './api/BusTrackerApi';

/**
 * Represents the shape of the BusTracker Application's state.
 */
export interface BusTrackerAppState {
	user: User;
	api: BusTrackerApi;
}

// Represents the initial state of the app on startup.
export const appState: BusTrackerAppState = {
	user: null,
	api: new BusTrackerApi()
}