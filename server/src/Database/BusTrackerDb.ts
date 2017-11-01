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
     * Checks that a user does not already exist in the system with the specified username.
     * @param username The username to check.
     * @returns A true result value if the username is free to use, otherwise false.
     */
    public async verifyUsername(username: string): Promise<TypedResult<boolean>> {

        // Try to find a user who has the given email address.
        const queryResult = await schema.UserType.findOne({ username: username }).cursor().next();

        // A null result means the user was found in the db with the provided username. The specified
        // username is free to use in that case.
        if (queryResult == null)
            return new TypedResult<boolean>(true, true);
        else
            return new TypedResult<boolean>(true, false);
    }

    /**
     * Registers a new user to the database.
     * @param user An object representing the user to register.
     * @returns A promise containing the result of the operation.
     */
    public async registerUser(user: models.User): Promise<Result> {

        // Before adding a new user to the database, verify no other user has their username.
        const verifyResult: TypedResult<boolean> = await this.verifyUsername(user.username);
        if (!verifyResult.success)
            return new Result(false, 'Failed to verify the new user\'s username.');
        if (!verifyResult.data)
            return new Result(false, 'A user with that username already exists.');

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
     * @param id The id of the user to delete.
     * @returns A promise containing the result of the operation.
     */
    public async deleteUser(id: string): Promise<Result> {

        // Remove the user with specified id from the database.
        const removeResult = await schema.UserType.findOne({ id: id }).remove();
        if (removeResult.result.ok)
            return new Result(true);
        else
            return new Result(false, `Unable to remove user with id: ${id}.`);
    }

    /**
     * Gets a user with matching id from the database.
     * @param id The id of the user to get.
     * @returns A promise containing the result of the operation. If successful, the result contains the user data.
     */
    public async getUser(id: string): Promise<TypedResult<models.User>> {

        // Find the user by their id.
        const resultUser: models.User = await schema.UserType.findOne({ id: id}).lean().cursor().next();
        if (resultUser == null)
            return new TypedResult<models.User>(false, null, `User with id ${id} not found.`);
        return new TypedResult<models.User>(true, resultUser);
    }

    /**
     * Allows a user to grant or revoke admin rights of a target user.
     * @param grantingId The id of the user who is attempting to grant admin rights.
     * @param targetId The id of the user who is to receive admin rights.
     * @param adminStatus True to grant admin rights, false to revoke them.
     * @returns A promise containing the result of the operation.
     */
    public async toggleAdminRights(grantingId: string, targetId: string, adminStatus: boolean): Promise<Result> {

        // Find the user attempting to grant admin rights.
        const grantingUserData: models.User = await schema.UserType.findOne({id: grantingId}).lean().cursor().next();
        if (grantingUserData == null)
            return new Result(false, `Granting user with id ${grantingId} not found.`);

        // Verify that the user granting the privileges has admin rights.
        if (!grantingUserData.isAdmin)
            return new Result(false, `Granting user with id ${grantingId} does not have administrative rights.`);

        // Find the target user.
        const targetUser: mongoose.Document = await schema.UserType.findOne({id: targetId}).cursor().next();
        if (targetUser == null)
            return new Result(false, `Target user with id ${targetId} not found.`);

        // Change the target user admin rights. Nothing happens if the toggle value matches their current rights.
        targetUser.set({isAdmin: adminStatus});
        await targetUser.save();

        return new Result(true);
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