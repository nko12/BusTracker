import * as signals from 'signals';

interface IBusTrackerEvents {
    login: {
        loginSucceeded: signals.Signal
    }
}

export interface LoginEvent {
    wasSuccess: boolean,
    errorMessage: string
}

export const BusTrackerEvents: IBusTrackerEvents = {
    login: {
        loginSucceeded: new signals.Signal()
    },
}