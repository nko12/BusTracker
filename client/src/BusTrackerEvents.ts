import * as signals from 'signals';

/**
 * The type of a selected object.
 */
export enum SelectedObjectType {
	None,
	Bus,
	Stop,
	Route
}

export interface MapDisplayChangeArguments {
	selectedObjectId: string,
	selectedObjectType: SelectedObjectType
}

interface IBusTrackerEvents {
	login: {
		loginSucceeded: signals.Signal
		logoutRequested: signals.Signal
	}
	map: {
		mapDisplayChangeRequested: signals.Signal
	}
}

export interface LoginEvent {
	wasSuccess: boolean,
	errorMessage: string
}

export const BusTrackerEvents: IBusTrackerEvents = {
	login: {
		/**
		 * Fired when the user is successfully logged in.
		 */
		loginSucceeded: new signals.Signal(),
		/**
		 * Fired when the user requests to be logged out.
		 */
		logoutRequested: new signals.Signal()
	},
	map: {
		/**
		 * Fired when the user requests the BusMap to display something.
		 */
		mapDisplayChangeRequested: new signals.Signal()
	}
}