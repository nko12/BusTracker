// Use 'require' as TypeScript will not compile when trying to set the Promise type of mongoose.
import mongoose = require('mongoose');

// Make mongoose use the native Promise type.
mongoose.Promise = global.Promise;

/**
 * Represents the shape of the configuration data that the server is being run with.
 */
export interface ServerConfig {

    /**
     * The port to use for the MongoDB database.
     */
    dbPort: number;

    /**
     * The name of the BusTracker MongoDB database.
     */
    dbName: string;

    /**
     * The hostname that the BusTracker MongoDB database is being hosted at.
     */
    dbHost: string;
}

/**
 * Represents the server configuration, set by the current execution environment (prod, test, etc.)
 */
export const serverConfig: ServerConfig = {
    dbPort: 0,
    dbName: '',
    dbHost: ''
};

// Set the 'serverConfig' variable depending on the current execution environment.
const environmentName: string = <string>process.env.NODE_ENV;
switch (environmentName.trim()) {
    case 'test':
        serverConfig.dbName = 'TestBusTracker';
        serverConfig.dbPort = 27017;
        serverConfig.dbHost = 'localhost'
        break;
    case 'prod':
        serverConfig.dbName = 'BusTracker';
        serverConfig.dbPort = 27017;
        serverConfig.dbHost = 'localhost'
        break;
    default:
        console.log(`Invalid node environment specified. '${process.env.NODE_ENV}' is not a valid environment.`)
        throw Error(`Invalid node environment specified. '${process.env.NODE_ENV}' is not a valid environment.`);
}