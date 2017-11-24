export const ACTION_APP_STARTUP = 'ACTION_APP_STARTUP';

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