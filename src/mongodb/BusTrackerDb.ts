import * as mongo from 'mongodb';
import { Result } from '../Result'

export class BusTrackerDb {

    /**
     * Represents the MongoDB client used to make queries against the MongoDB instance.
     */
    private client: mongo.MongoClient;

    // Use the default MongoDB port.
    private port: number = 27017;

    /**
     * Creates a new BusTrackerDb object.
     * @param client The MongoClient instance to use.
     */
    public constructor(client: mongo.MongoClient) {
        this.client = client;
    }

    /**
     * Initializes the BusTracker database.
     * @returns The result of the operation.
     */
    public async init(): Promise<Result> {

        // Attempt to connect to MongoDB.
        try {
            await this.client.connect(`mongodb://localhost:${this.port}/BusTracker`);
        } catch (err) {

            return new Result(false, 'Failed to connect to MongoDB.');
        }
        
        return new Result(true);
    }
}