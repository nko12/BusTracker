import { User } from './models/User';
import { BusTrackerApi } from './api/BusTrackerApi';

/**
 * The type of a selected object.
 */
enum SelectedObjectType {
    None,
    Route,
    BusStop,
    Bus
}
export interface SelectedObjectState {
    selectedObjectId: string,
    selectedObjectType: SelectedObjectType
}

/**
 * Represents the shape of the BusTracker Application's state.
 */
export interface BusTrackerAppState {
    user: User
    selectedObject: SelectedObjectState,
    api: BusTrackerApi
}

// Represents the intiial state of the app on startup.
export const appState: BusTrackerAppState =  {
    user: null,
    selectedObject: {
        selectedObjectId: null,
        selectedObjectType: SelectedObjectType.None
    },
    api: new BusTrackerApi()
}