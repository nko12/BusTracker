import * as mongo from 'mongodb';
import * as mongoose from 'mongoose';

import * as models from '../Models';
import { serverConfig } from '../ServerConfig'
import * as schema from './DBSchemas'
import { Result, TypedResult } from '../Result';

/**
 * An object that will perform communications with the MongoDB database, with methods to perform common
 * actions such as registering a user and adding a new route.
 */
export class BusTrackerDB {

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
            schema.Schemas.schemaNames.forEach((schemaName: string) => {

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

    /**
     * Checks that a user does not already exist in the system with the specified email address.
     * @param emailAddress The email address to check.
     * @returns A true result value if the email is free to use, otherwise false.
     */
    public async verifyEmail(emailAddress: string): Promise<TypedResult<boolean>> {

        // Try to find a user who has the given email address.
        const queryResult = await schema.UserType.findOne({email: emailAddress}).cursor().next();

        // A null result means know user was found in the db with the provided email address. The specified
        // email address is free to use in that case.
        if (queryResult == null)
            return new TypedResult<boolean>(true, true);
        else
            return new TypedResult<boolean>(true, false);
    }

    /**
     * Registers a new user to the database.
     * @param user An object representing the user to register.
     * @returns The result of the operation.
     */
    public async registerUser(user: models.User): Promise<Result> {

        // Before adding a new user to the database, verify no other user has their email address.
        const verifyResult: TypedResult<boolean> = await this.verifyEmail(user.email);
        if (!verifyResult.success)
            return new Result(false, 'Failed to verify the new user\'s email address.');
        if (!verifyResult.data)
            return new Result(false, 'A user with that email address already exists.');
        
        // Add the new user to the database.
        const newUser = new schema.UserType(user);
        try {
            await newUser.save();
        } catch (err) {
            return new Result(false, `Failed to create a new user object. ${JSON.stringify(err)}.`);
        }
       
        return new Result(true);
    }

    /**
     * Removes the user with matching id from the database.
     * @param userId The id of the user to delete.
     */
    public async deleteUser(userId: string): Promise<Result> {

        // Remove the user with specified id from the database.
        const removeResult = await schema.UserType.findOne({id: userId}).remove();
        if (removeResult.result.ok)
            return new Result(true);
        else
            return new Result(false, `Unable to remove user with id: ${userId}.`);
    }
}