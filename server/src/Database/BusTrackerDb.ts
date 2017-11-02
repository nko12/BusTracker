import * as mongo from 'mongodb';
import * as mongoose from 'mongoose';

import * as models from '../Models';
import { serverConfig } from '../ServerConfig'
import * as schema from './DBSchemas'
import { Result, TypedResult } from '../Result';

// Make mongoose use the native Promise type.
mongoose.Promise = global.Promise;

/**
 * An object that will perform communications with the MongoDB database, with methods to perform common
 * actions such as registering a user and adding a new route.
 */
export class BusTrackerDB {

    /**
     * Represents the mongoose client used to make queries against the MongoDB instance.
     */
    private dbConn?: mongoose.Connection;

    /**
     * Creates a new BusTrackerDb object.
     * @param client The MongoClient instance to use.
     */
    public constructor(client?: mongoose.Connection) {
        this.dbConn = client;
    }

    /**
     * Initializes the BusTracker database. If the connection provided in the constructor was not already connected, 
     * this will also attempt to connect to a 'BusTracker' database on port 27017.
     * @param client The mongoose connection to the database. 
     * @returns The result of the operation.
     */
    public async init(): Promise<void> {

        // If a connection is not provided, attempt to connect.
        if (this.dbConn == undefined) {

            try {

                this.dbConn = await this.initConnection();
                if (this.dbConn == undefined) {
                    throw new Error("Failed to connect to the database. Is MongoDB running?");
                }
            } catch (err) {

                throw new Error("Failed to connect to the database. Is MongoDB running?");
            }    
        }

        try {

            // Get the names of the existing collections.        
            const cursor: mongo.CommandCursor = this.dbConn.db.listCollections({});
            const collectionList = await cursor.toArray();

            // For each schema name, there should be dbConnesponding collection for it. Loop through each schema name, and
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
                await this.dbConn.db.createCollection(pendingCollectionNames[i]);
            }

        } catch (err) {

            console.log(`Failed to initialize the database. ${JSON.stringify(err)}`);
            throw new Error(`Failed to initialize the database. ${JSON.stringify(err)}`);
        }
    }

    /**
     * Checks that a user does not already exist in the system with the specified email address.
     * @param emailAddress The email address to check.
     * @returns A true result value if the email is free to use, otherwise false.
     */
    public async verifyEmail(emailAddress: string): Promise<TypedResult<boolean>> {

        // Try to find a user who has the given email address.
        const queryResult = await schema.UserType.findOne({ email: emailAddress }).cursor().next();

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
        const removeResult = await schema.UserType.findOne({ id: userId }).remove();
        if (removeResult.result.ok)
            return new Result(true);
        else
            return new Result(false, `Unable to remove user with id: ${userId}.`);
    }

    /**
     * Gets a user with matching email from the database.
     * @param email The email address of the user to get.
     * @returns A promise containing the result of the operation. If successful, the result contains the user data.
     */
    public async getUser(email: string): Promise<TypedResult<models.User>> {

        // Find the user by their email address.
        const resultUser: models.User = await schema.UserType.findOne({ email: email}).lean().cursor().next();
        if (resultUser == null)
            return new TypedResult<models.User>(false, null, `User with email ${email} not found.`);
        return new TypedResult<models.User>(true, resultUser);
    }

    /**
     * Attempts to connect to the database.
     * @returns The connection to the database if successful, otherwise an error.
     */
    private initConnection(): Promise<mongoose.Connection | undefined> {
        const conn: mongoose.Connection =
            mongoose.createConnection(`mongodb://${serverConfig.dbHost}:${serverConfig.dbPort}/${serverConfig.dbName}`, { useMongoClient: true });
        
        return new Promise<mongoose.Connection | undefined>((resolve, reject) => {
            conn.on('error', (err) => {
                reject(err);
            });
            conn.once('open', () => { 
                resolve(conn); 
            });
        }); 
    }
}