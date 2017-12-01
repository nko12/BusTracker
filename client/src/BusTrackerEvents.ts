import * as signals from 'signals';
import {Coords} from 'google-map-react';

/**
 * The type of a selected object for the BusMap.
 */
export enum SelectedObjectType {
	/**
	 * The BusMap should not display anything.
	 */
	None,
	/**
	 * The BusMap is being asked to display a specific stop and the busses serving that stop.
	 */
	Stop,
	/**
	 * The BusMap is being asked to display a specific route.
	 */
	Route
}

/**
 * The event args for the mapDisplayChangeRequested signal.
 */
export interface MapDisplayChangeArguments {
	/**
	 * The id of the object to display.
	 */
	ID: string;
	/**
	 * The type of the object to display.
	 */
	type: SelectedObjectType;
	/**
	 * If the type is a route, this is the polyline the BusMap should display.
	 */
	polyString?: string;
	/**
	 * If the type is a bus stop, this is the latitude/longitude where the marker should
	 * be displayed.
	 */
	location?: Coords;
}

/**
 * An interface representing the shape of the object that contains the various events
 * that the application uses to run.
 */
interface IBusTrackerEvents {
	login: {
		loginSucceeded: signals.Signal,
		logoutRequested: signals.Signal
	};
	map: {
		mapDisplayChangeRequested: signals.Signal
    };
    toast: {
        showToastRequested: signals.Signal;
    }
}

/**
 * Contains some of the signals that help drive the application.
 */
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
    },
    toast: {
        /**
         * Fired when a control wants to show a toast message.
         */
        showToastRequested: new signals.Signal()
    }
}