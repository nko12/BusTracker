import * as mongo from 'mongodb';
import * as mongoose from 'mongoose';
import { serverConfig } from '../ServerConfig'
import { Schemas } from './DbSchemas';
import { Result } from '../Result';

/**
 * Represents the connection state of a mongoose connection.
 */
enum ConnectionState {
    Disconnected = 0,
    Connected = 1,
    Connecting = 2,
    Disconnecting = 3
}

/**
 * An object that will perform communications with the MongoDB database, with methods to perform common
 * actions such as registering a user and adding a new route.
 */
export class BusTrackerDb {

    /**
     * Represents the mongoose client used to make queries against the MongoDB instance.
     */
    private client: mongoose.Connection;

    /**
     * Creates a new BusTrackerDb object.
     * @param client The MongoClient instance to use.
     */
    public constructor(client: mongoose.Connection | null) {
        if (client != null) {
            this.client = client;
        }
    }

    /**
     * Initializes the BusTracker database. If the connection provided in the constructor was not already connected, 
     * this will also attempt to connect to a 'BusTracker' database on port 27017.
     * @param client The mongoose connection to the database. 
     * @returns The result of the operation.
     */
    public async init(): Promise<Result> {

        // Attempt to connect to MongoDB.
        let db: mongo.Db;
        try {

            switch (this.client.readyState) {
                case ConnectionState.Disconnected:
                    // Connect using the database 'BusTracker' and port '27017'.
                    this.client = await mongoose.connect(`mongodb://${serverConfig.dbHost}:${serverConfig.dbPort}/${serverConfig.dbName}`);
                    console.log(`MongoDB: Successfully connected to the ${serverConfig.dbName} database.`);
                    break;
            }

            // Verify all the necessary collections exist, creating them if they don't.
            // const userModel = mongoose.model('User', Schemas.userSchema);

        } catch (err) {

            return new Result(false, 'Failed to connect to MongoDB.' + JSON.stringify(err));
        }

        return new Result(true);
    }
}