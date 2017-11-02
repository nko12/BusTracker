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

    /**
     * The port that the server will listen on.
     */
    serverPort: number;
}

/**
 * Represents the server configuration, set by the current execution environment (prod, test, etc.)
 */
export const serverConfig: ServerConfig = {
    dbPort: 0,
    dbName: '',
    dbHost: '',
    serverPort: 0
};

// Set the 'serverConfig' variable depending on the current execution environment.
const environmentName: string = <string>process.env.NODE_ENV;
switch (environmentName.trim()) {
    case 'test':
        serverConfig.dbName = 'TestBusTracker';
        serverConfig.dbPort = 27017;
        serverConfig.dbHost = 'localhost'
        serverConfig.serverPort = 5000;
        break;
    case 'prod':
        serverConfig.dbName = 'BusTracker';
        serverConfig.dbPort = 27017;
        serverConfig.dbHost = 'localhost'
        serverConfig.serverPort = 80;
        break;
    default:
        console.log(`Invalid node environment specified. '${process.env.NODE_ENV}' is not a valid environment.`)
        throw Error(`Invalid node environment specified. '${process.env.NODE_ENV}' is not a valid environment.`);
}