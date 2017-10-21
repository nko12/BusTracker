import * as mongo from 'mongodb';
import * as mongoose from 'mongoose';
import { serverConfig } from '../ServerConfig'
import { Schemas } from './DbSchemas';
import { Result } from '../Result';

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
        } else {
            throw Error('Not yet implemented. BusTrackerDb must be initailized with a valid mongoose connection.');
        }
    }

    /**
     * Initializes the BusTracker database. If the connection provided in the constructor was not already connected, 
     * this will also attempt to connect to a 'BusTracker' database on port 27017.
     * @param client The mongoose connection to the database. 
     * @returns The result of the operation.
     */
    public async init(): Promise<Result> {

        try {
            // Get the names of the existing collections.        
            const cursor: mongo.CommandCursor = this.client.db.listCollections({});
            const collectionList = await cursor.toArray();

            // For each schema name, there should be a corresponding collection for it. Loop through each schema name, and
            // if a collection does not exist for it, create the collection.
            const pendingCollectionNames: string[] = [];
            Schemas.schemaNames.forEach((schemaName: string) => {

                if (collectionList.findIndex((collection: mongo.Collection): boolean => {
                    return collection.collectionName === schemaName;
                }) == -1) {
                    // The given schema name does not have a matching collection. Create the collection.
                    pendingCollectionNames.push(schemaName);
                }
            });

            // Create a collection for all the pending collection names.
            for (let i: number = 0; i < pendingCollectionNames.length; i++) {
                await this.client.db.createCollection(pendingCollectionNames[i]);
            }

        } catch (err) {

            console.log('Failed to connect to MongoDB. ' + JSON.stringify(err));
            return new Result(false, 'Failed to connect to MongoDB.' + JSON.stringify(err));
        }

        return new Result(true);
    
    }


}