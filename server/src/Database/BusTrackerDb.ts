import * as mongo from 'mongodb';
import * as mongoose from 'mongoose';
import * as faker from 'faker';

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

        // try {

        //     // Get the names of the existing collections.        
        //     const cursor: mongo.CommandCursor = this.dbConn.db.listCollections({});
        //     const collectionList = await cursor.toArray();

        //     // For each schema name, there should be dbConnesponding collection for it. Loop through each schema name, and
        //     // if a collection does not exist for it, create the collection.
        //     const pendingCollectionNames: string[] = [];
        //     schema.Schemas.schemaNames.forEach((schemaName: string) => {

        //         if (collectionList.findIndex((collection: mongo.Collection): boolean => {
        //             return collection.collectionName === schemaName;
        //         }) == -1) {
        //             // The given schema name does not have a matching collection. Create the collection.
        //             pendingCollectionNames.push(schemaName);
        //         }
        //     });

        //     // Create a collection for all the pending collection names.
        //     for (let i: number = 0; i < pendingCollectionNames.length; i++) {
        //         await this.dbConn.db.createCollection(pendingCollectionNames[i]);
        //     }

        // } catch (err) {

        //     console.log(`Failed to initialize the database. ${JSON.stringify(err)}`);
        //     throw new Error(`Failed to initialize the database. ${JSON.stringify(err)}`);
        // }
    }

    /**
     * Checks that a user does not already exist in the system with the specified username.
     * @param username The username to check.
     * @returns A true result value if the username is free to use, otherwise false.
     */
    public async verifyUsername(username: string): Promise<TypedResult<boolean>> {

        // Try to find a user who has the given username.
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
    public async registerUserObject(user: models.User): Promise<Result> {

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
     * Registers a new user to the database.
     * @param username The new username for the user.
     * @param passwordHash The password hash for the new user.
     * @returns The new user object that was created from the registration.
     */
    public async registerUser(username: string, passwordHash: string): Promise<TypedResult<models.User>> {

        // Create a blank user object and set the username and password hash on it.
        const userData: models.User = new models.User();
        userData.username = username;
        userData.passwordHash = passwordHash;

        // Call registerUserObject.
        const result: Result = await this.registerUserObject(userData);
        if (!result.success) {
            return new TypedResult<models.User>(false, null, result.message);
        }

        return new TypedResult<models.User>(true, userData);
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
     * @param username The username of the user to get.
     * @param passwordHash The password hash of the user, generated client side from their password.
     * @returns A promise containing the result of the operation. If successful, the result contains the user data.
     */
    public async loginUser(username: string, passwordHash: string): Promise<TypedResult<models.User>> {

        // Find the user by their username.
        const resultUser: models.User = await schema.UserType.findOne({ username: username }).lean().cursor().next();

        // If the user wasn't found, return a failing result.
        if (resultUser == null)
            return new TypedResult<models.User>(false, null, `User with username ${username} not found.`);

        // If the provided password hash doesn't match the password hash of this username, return a failing result.
        if (resultUser.passwordHash !== passwordHash)
            return new TypedResult<models.User>(false, null, `User with username ${username} provided an invalid password.`);

        // The user was found and they provided a valid password.
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
        const grantingUserData: models.User = await schema.UserType.findOne({ id: grantingId }).lean().cursor().next();
        if (grantingUserData == null)
            return new Result(false, `Granting user with id ${grantingId} not found.`);

        // Verify that the user granting the privileges has admin rights.
        if (!grantingUserData.isAdmin)
            return new Result(false, `Granting user with id ${grantingId} does not have administrative rights.`);

        // Find the target user.
        const targetUser: mongoose.Document = await schema.UserType.findOne({ id: targetId }).cursor().next();
        if (targetUser == null)
            return new Result(false, `Target user with id ${targetId} not found.`);

        // Change the target user admin rights. Nothing happens if the toggle value matches their current rights.
        targetUser.set({ isAdmin: adminStatus });
        await targetUser.save();

        return new Result(true);
    }

    /**
     * Edits the favorite bus stop ids of a particular user. Pass in all ids that should be considered
     * favorited by the user.
     * @param userID The user id of the user whose favorite bus stop ids should be edited.
     * @param ids The list of bus stop ids to set on the user.
     */
    public async editFavoriteBusStopIDs(userId: string, ids: Array<string>): Promise<Result> {

        // Ensure the user exists.
        const user: mongoose.Document = await schema.UserType.findOne({ id: userId }).cursor().next();
        if (user == null)
            return new Result(false, `User with id ${userId} not found.`);

        // Set the user's favorite bus stop ids to the value passed in.
        user.set({ favoriteStopIds: ids });
        await user.save();

        return new Result(true);
    }

    /**
     * Edits the favorite route ids of a particular user. Pass in all ids that should be considered
     * favorited by the user.
     * @param userId The user id of the user whose favorite route ids should be edited.
     * @param ids The list of route ids to set on the user.
     * @returns The result of the operation.
     */
    public async editFavoriteRouteIDs(userId: string, ids: Array<string>): Promise<Result> {

        // Ensure the user exists.
        const user: mongoose.Document = await schema.UserType.findOne({ id: userId }).cursor().next();
        if (user == null)
            return new Result(false, `User with id ${userId} not found.`);

        // Set the user's favorite bus stop ids to the value passed in.
        user.set({ favoriteRouteIds: ids });
        await user.save();

        return new Result(true);
    }

    /**
     * Allows an admin to add a new fake route to the database.
     * @param userId The user id of the user trying to add the new route.
     * @param routeData The route object to add.
     * @returns The id of the new route. The id will start with 'FAKE_' to help set this route apart from BusTime routes.
     */
    public async addNewRoute(userId: string, routeData: models.Route): Promise<TypedResult<string | null>> {

        // Ensure the user exists.
        const user: mongoose.Document = await schema.UserType.findOne({ id: userId }).cursor().next();
        if (user == null)
            return new TypedResult(false, null, `User with id ${userId} not found.`);

        // The user must be an admin.
        if ((<boolean>user.get('isAdmin')) == false)
            return new TypedResult(false, null, `User with id ${userId} is not an admin.`);

        // Create a new route type and give it the route model.
        routeData.id = 'FAKE_' + faker.random.uuid();
        const route = new schema.RouteType(routeData);
        await route.save();

        return new TypedResult(true, routeData.id);
    }

    /**
     * Allows an admin to add a new fake route to the database.
     * @param userId The user id of the user trying to add the bus stop.
     * @param stopData The bus stop object to add.
     * @returns The id of the new bus stop. The id will start with 'FAKE_' to help set this route apart from BusTime routes.
     */
    public async addNewBusStop(userId: string, stopData: models.BusStop): Promise<TypedResult<string | null>> {

        // Ensure the user exists.
        const user: mongoose.Document = await schema.UserType.findOne({ id: userId }).cursor().next();
        if (user == null)
            return new TypedResult(false, null, `User with id ${userId} not found.`);

        // The user must be an admin.
        if ((<boolean>user.get('isAdmin')) == false)
            return new TypedResult(false, null, `User with id ${userId} is not an admin.`);

        // Create a new bus stop type and give it the bus stop model.
        stopData.id = 'FAKE_' + faker.random.uuid();
        const busStop = new schema.BusStopType(stopData);
        await busStop.save();

        return new TypedResult(true, stopData.id);
    }

    /**
     * Adds a new real bus stop to the database. The id should already be set.
     * @param stopData The stop data to add to the database. If it already exists, it is overwritten.
     */
    public async addNewRealBusStop(stopData: models.BusStop): Promise<Result> {

        // Check if the bus stop already exists. If it does, ignore this request.
        let busStop: mongoose.Document = await schema.BusStopType.findOne({ id: stopData.id }).cursor().next();
        if (busStop != null) {
            return new Result(true);
        }

        busStop = new schema.BusStopType(stopData);
        await busStop.save();
        return new Result(true);
    }

    /**
     * Adds a new real route to the database. The id should already be set.
     * @param routeData The route data to add to the database. if it already exists, it is overwritten.
     */
    public async addNewRealRoute(routeData: models.Route): Promise<Result> {

        // Check if the route already exists. If it does, ignore this request.
        let route: mongoose.Document = await schema.RouteType.findOne({ id: routeData.id }).cursor().next();
        if (route != null) {
            return new Result(true);
        }

        route = new schema.RouteType(routeData);
        await route.save();
        return new Result(true);
    }

    /**
     * Gets the specified route object by id.
     * @param routeId The id of the route to get.
     * @returns The requested route object.
     */
    public async getRoute(routeId: string): Promise<TypedResult<models.Route | null>> {

        // Get the route object.
        const route: models.Route = await schema.RouteType.findOne({ id: routeId }).lean().cursor().next();

        // The route should exist.
        if (route == null)
            return new TypedResult(false, null, `Route with id ${routeId} not found.`);

        return new TypedResult(true, route);
    }

    /**
     * Gets the specified routes by id.
     * @param routeIds The ids of the route objects to get.
     * @returns A result containing the list of routes.
     */
    public async getRoutes(routeIds: Array<string>): Promise<TypedResult<Array<models.Route> | null>> {

        // Search for all routes matching the specified ids.
        try {
            const cursor = schema.RouteType.find({id: {"$in": routeIds}}).lean().cursor();
            const routes: Array<models.Route> = new Array<models.Route>();
            await cursor.eachAsync((route: models.Route) => {
                routes.push(route);
            });
    
            return new TypedResult(true, routes);
        } catch (err) {
            return new TypedResult(false, null, 'Failed to get the requested routes: ' + JSON.stringify(err));
        }
    }

    /**
     * Gets the specified bus stops by id.
     * @param stopIds The ids of the bus stop objects to get.
     * @returns A result containing the list of bus stops.
     */
    public async getBusStops(stopIds: Array<string>): Promise<TypedResult<Array<models.BusStop> | null>> {

        // Search for all bus stops matching the specified ids.
        try {
            const cursor = schema.BusStopType.find({id: {"$in": stopIds}}).lean().cursor();
            const stops: Array<models.BusStop> = new Array<models.BusStop>();
            await cursor.eachAsync((stop: models.BusStop) => {
                stops.push(stop);
            });

            return new TypedResult(true, stops);
        } catch (err) {
            return new TypedResult(false, null, 'Failed to get the requested bus stops: ' + JSON.stringify(err));
        }
    }

    /**
     * Gets the specified bus stop by id.
     * @param stopId The id of the bus stop to get.
     * @returns The requested bus stop id.
     */
    public async getBusStop(stopId: string): Promise<TypedResult<models.BusStop | null>> {

        // Get the bus stop object.
        const stop: models.BusStop = await schema.BusStopType.findOne({ id: stopId }).lean().cursor().next();

        // The bus stop should exist.
        if (stop == null)
            return new TypedResult(false, null, `Bus Stop with id ${stopId} not found.`);

        return new TypedResult(true, stop);
    }

    /**
     * Allows an admin to remove an existing fake route from the database.
     * @param userId The user id of the user trying to remove the route.
     * @param routeId The id of the route to remove.
     * @returns The result of the operation.
     */
    public async removeRoute(userId: string, routeId: string): Promise<Result> {

        // TODO: When removing a route, it should be removed from all users who have it favorited.

        // Ensure the user exists.
        const user: mongoose.Document = await schema.UserType.findOne({ id: userId }).cursor().next();
        if (user == null)
            return new Result(false, `User with id ${userId} not found.`);

        // The user must be an admin.
        if ((<boolean>user.get('isAdmin')) == false)
            return new Result(false, `User with id ${userId} is not an admin.`);

        // Get the route to remove. The route must exist in order to remove it.
        const route: mongoose.Document = await schema.RouteType.findOne({ id: routeId }).cursor().next();
        if (route == null)
            return new Result(false, `Route with id ${routeId} not found.`);

        // Delete the route.
        await route.remove();

        return new Result(true);
    }

    /**
     * Allows an admin to remove an existing fake bus stop from the database.
     * @param userId The user id of the user trying to remove the bus stop.
     * @param stopId The id of the bus stop to remove.
     * @returns The result of the operation.
     */
    public async removeBusStop(userId: string, stopId: string): Promise<Result> {

        // TODO: When removing a bus stop, it should be removed from all users who have it favorited.

        // Ensure the user exists.
        const user: mongoose.Document = await schema.UserType.findOne({ id: userId }).cursor().next();
        if (user == null)
            return new Result(false, `User with id ${userId} not found.`);

        // The user must be an admin.
        if ((<boolean>user.get('isAdmin')) == false)
            return new Result(false, `User with id ${userId} is not an admin.`);

        // Get the bus stop to remove. The bus stop must exist in order to remove it.
        const busStop: mongoose.Document = await schema.BusStopType.findOne({ id: stopId }).cursor().next();
        if (busStop == null)
            return new Result(false, `Bus Stop with id ${stopId} not found.`);

        // Delete the bus stop.
        await busStop.remove();

        return new Result(true);
    }

    /**
     * Attempts to connect to the database.
     * @returns The connection to the database if successful, otherwise an error.
     */
    private initConnection(): Promise<mongoose.Connection | undefined> {
        /*  const conn: mongoose.Connection =
             mongoose.createConnection(`mongodb://${serverConfig.dbHost}:${serverConfig.dbPort}/${serverConfig.dbName}`, { useMongoClient: true }); */
        mongoose.connect(serverConfig.dbConnString, { useMongoClient: true });

        return new Promise<mongoose.Connection | undefined>((resolve, reject) => {
            mongoose.connection.on('error', (err) => {
                reject(err);
            });
            mongoose.connection.once('open', () => {
                resolve(mongoose.connection);
            });
        });
    }
}