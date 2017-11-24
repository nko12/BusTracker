import * as signals from 'signals';

interface IBusTrackerEvents {
    login: {
        loginSucceeded: signals.Signal,
        loginFailed: signals.Signal
    }
}

export const BusTrackerEvents: IBusTrackerEvents = {
    login: {
        loginSucceeded: new signals.Signal(),
        loginFailed: new signals.Signal()
    },
}