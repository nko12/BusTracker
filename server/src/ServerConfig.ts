/**
 * Represents the shape of the configuration data that the server is being run with.
 */
export interface ServerConfig {

    /**
     * The connection string that should be used to connect to the database.
     */
    dbConnString: string;

    /**
     * The port that the server will listen on.
     */
    serverPort: number;
}

/**
 * Represents the server configuration, set by the current execution environment (prod, test, etc.)
 */
export const serverConfig: ServerConfig = {
    dbConnString: '',
    serverPort: 0
};

// Set the 'serverConfig' variable depending on the current execution environment.
const environmentName: string = <string>process.env.NODE_ENV;
switch (environmentName.trim()) {
    case 'test':
        serverConfig.dbConnString = 'mongodb://localhost:27017/TestBusTracker';
        serverConfig.serverPort = 5000;
        break;
    case 'prod':
    {
        if (!process.env.MONGODB_URI)
            throw Error('The environment variable \'MONGODB_URI\' was expected to exist but is not defined.');
        serverConfig.dbConnString = <string> process.env.MONGODB_URI;
        serverConfig.serverPort = 80;
        break;
    }
        
    case 'dev':
    default:
        serverConfig.dbConnString = 'mongodb://localhost:27017/BusTracker';
        serverConfig.serverPort = 5000;
        break;
}