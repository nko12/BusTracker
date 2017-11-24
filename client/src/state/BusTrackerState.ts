

// Define the different types of actions.

/**
 * Occurs when a user successfully logs in or registers.
 */
export const ACTION_LOGIN_SUCCESS = 'ACTION_LOGIN_SUCCESS';

/**
 * Occurs when a user login or register fails.
 */
export const ACTION_LOGIN_FAIL = 'ACTION_LOGIN_FAIL';

export interface ReduxAction {
    type: string;
}

export interface LoginSuccessAction extends ReduxAction {
    isRegister: boolean
}

export interface LoginFailAction extends ReduxAction {
    errorMessage: string
}

/**
 * Action creator for the successful login action. 
 * @param isRegister Whether or not the login is actual login or registration.
 */
export function loginSuccessAction(isRegister: boolean): LoginSuccessAction {
    return {
        type: ACTION_LOGIN_SUCCESS,
        isRegister: isRegister
    };
}

/**
 * Action creator for the fail login action.
 * @param errorMessage The error message as to why user login or register failed.
 */
export function loginFailAction(errorMessage: string): LoginFailAction {
    return {
        type: ACTION_LOGIN_FAIL,
        errorMessage: errorMessage
    };
}

export interface BusTrackerAppState {
    isLoggedIn: boolean,
}

// Represents the intiial state of the app on startup.
export const initialState: BusTrackerAppState =  {
    isLoggedIn: false
}

export function busTrackerRootReducer(state: BusTrackerAppState = initialState, action: ReduxAction) {
    switch (action.type) {
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