import * as mongo from 'mongodb';
import * as mongoose from 'mongoose';
import { Result } from '../Result'

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
        if (client == null)
            this.client = await mongoose.connect('');
    }

    /**
     * Initializes the BusTracker database.
     * @param client The mongoose connection to the database. If not specified, uses 'BusTracker' database on port 27017.
     * @returns The result of the operation.
     */
    public async init(conn: mongoose.Connection | null): Promise<Result> {

        // Attempt to connect to MongoDB.
        let db: mongo.Db;
        try {

            db = await this.client.connect(`mongodb://localhost:${this.port}/BusTracker`);
            console.log('MongoDB: Successfully connected to the BusTracker database.');

            // Verify all the necessary collections exist, creating them if they don't.
            
            
        } catch (err) {

            return new Result(false, 'Failed to connect to MongoDB.');
        }
        
        

        return new Result(true);
    }
}