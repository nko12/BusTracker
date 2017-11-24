// Define the different types of actions.
import { ReduxAction } from './BusTrackerActions';
import * as cookies from 'js-cookie';

/**
 * The type of a selected object.
 */
enum SelectedObjectType {
    None,
    Route,
    BusStop,
    Bus
}

export interface UserState {
    isLoggedIn: boolean,
    userId: string,
    isAdmin: boolean,
    favoriteRouteIds: Array<string>,
    favoriteStopIds: Array<string>
}

export interface SelectedObjectState {
    selectedObjectId: string,
    selectedObjectType: SelectedObjectType
}

/**
 * Represents the shape of the BusTracker Application's state.
 */
export interface BusTrackerAppState {
    user: UserState
    selectedObject: SelectedObjectState
}

// Represents the intiial state of the app on startup.
export const initialState: BusTrackerAppState =  {
    user: {
        isLoggedIn: cookies.get('userId') != null,
        userId: cookies.get('userId'),
        isAdmin: false,
        favoriteRouteIds: [],
        favoriteStopIds: []
    },
    selectedObject: {
        selectedObjectId: null,
        selectedObjectType: SelectedObjectType.None
    }
}

function loginReducer(state: UserState, action: ReduxAction) {
    
}

export default function busTrackerRootReducer(state: BusTrackerAppState = initialState, action: ReduxAction) {
    switch (action.type) {
        case ACTION_APP_STARTUP:

            return Object.assign({}, state, {
                isLoggedIn: (<AppStartupAction> action).loggedInUserId != undefined
            });
        case ACTION_LOGIN_SUCCESS:
            return Object.assign({}, state, {
                isLoggedIn: true
            });
        case ACTION_LOGIN_FAIL:
            return Object.assign({}, state, {
                isLoggedIn: false
            });
        default:
            return state;
    }
}