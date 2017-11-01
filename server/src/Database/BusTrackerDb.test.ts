import * as assert from 'assert';
import * as sinon from 'sinon';
import * as mongo from 'mongodb';
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
import * as mongoose from 'mongoose';
var equal = require('deep-equal');

import * as models from '../Models';
import { Schemas, UserType, BusTrackerDB } from '../Database'
import { Result, TypedResult } from '../Result'
import { serverConfig } from '../ServerConfig'
import { copyInCommonProperties } from '../Util'

// TODO: Remove chai and sinon setup code if not used once more tests are written.
// Set up Chai to use sinon-chai.
chai.should();
chai.use(sinonChai);

let sandbox: sinon.SinonSandbox;

beforeEach(() => {
    sandbox = sinon.sandbox.create();
});

afterEach(() => {
    sandbox.restore();
});

// Tests for BusTrackerDB's Initialization method.
describe('BusTrackerDB Initialization', () => {

    // BusTrackerDB's 'init' method should create all collections if they are missing.
    it('should create missing collections if they don\'t exist.', (done) => {

        // Create and initialize a connection to the database.
        mongoose.connect(`mongodb://${serverConfig.dbHost}:${serverConfig.dbPort}/${serverConfig.dbName}`, { useMongoClient: true });
        mongoose.connection.once('open', async () => {
            
            const conn: mongoose.Connection = mongoose.connection;
            const db: BusTrackerDB = new BusTrackerDB(conn);
            await db.init();

            // The BusTrackerDB class should have created the missing collections. There should be at least one collection
            // in the test database.
            const cursor = conn.db.listCollections({});
            const collections = await cursor.toArray();
            chai.expect(collections.length).to.be.greaterThan(0);

            done();
        });
    });
});

// Tests for BusTrackerDB.
describe('BusTrackerDB', () => {

    // The bus tracker database instance that all the tests will use. It is initialized before tests use it, as they
    // all assume it has been initialized.
    let appDB: BusTrackerDB;

    before((done: MochaDone) => {

        function initBusTrackerDBCallback() {

            // Initailization the BusTrackerDB object.
            appDB = new BusTrackerDB(mongoose.connection);
            appDB.init().then(() => {
                // End test bootstrap.
                done();
            }).catch((err) => {
                
                // Rethrow the error.
                throw err;
            });
        }

        // Create and initialize a connection to the database. (1 = connected)
        if (mongoose.connection.readyState == 1) {

            initBusTrackerDBCallback();          
        } else {

            mongoose.connect(`mongodb://${serverConfig.dbHost}:${serverConfig.dbPort}/${serverConfig.dbName}`, { useMongoClient: true });        
            mongoose.connection.once('open', () => {

                initBusTrackerDBCallback(); 
            });
        }    
    });

    // Tests for BusTrackerDB's 'verifyUsername' method.
    describe('#verifyUsername', () => {

        // BusTrackerDB's 'verifyUsername' method should fail if a user with the same username adready exists.
        it('should fail if a user with the same username already exists.', async () => {

            // Create a user to put in User database.
            const userData = models.User.generateRandomUser();
            const user1 = new UserType(userData);
            await user1.save();

            // Verify an email address.
            const result: TypedResult<boolean> = await appDB.verifyUsername(userData.username);

            // Since that email address already exists, BusTrackerDB should have returned an error.
            chai.assert(result.success);
            chai.expect(result.data).to.be.false;
        });
    })

    // Tests for BusTrackerDB's 'registerUser' method.
    describe('#registerUser', () => {

        // BusTrackerDB's 'registerUser' method should successfully create a new user in the database.
        it('should add a new user into the database with matching properties.', async () => {

            // Create a user to put in the database.
            const userData = models.User.generateRandomUser();

            // Attempt to register a new user.
            const result: Result = await appDB.registerUser(userData);

            // Registration of the user should be successful.
            chai.expect(result.success).to.be.true;

            // The database should now have a user with all the matching properties.
            const locatedUser = await UserType.findOne({ id: userData.id }).lean().cursor().next();

            // The user should have been created in the database. The query above should have found it.
            chai.expect(locatedUser).to.not.be.null;

            // Remove extra properties before comparison.
            const resultUser: models.User = new models.User();
            copyInCommonProperties(locatedUser, resultUser);

            // The two user objects should be equal.
            chai.expect(equal(resultUser, userData)).to.be.true;
        });

        // BusTrackerDB's 'registerUser' method should fail if a user with the same username already exists.
        it('should fail if a user with the same username already exists.', async () => {

            // Create a user to put in the database.
            const firstUserData: models.User = models.User.generateRandomUser();
            const firstUser = new UserType(firstUserData);
            await firstUser.save();

            // Create a new user with different properties except the username is the same.
            const secondUserData: models.User = models.User.generateRandomUser();
            secondUserData.username = firstUserData.username;

            // Attempt to register the new user who has the same username as the first.
            const result: Result = await appDB.registerUser(secondUserData);

            // The register operation should fail.
            chai.expect(result.success).to.be.false;
        });
    });

    // Tests for BusTrackerDB's 'deleteUser' method.
    describe('#deleteUser', () => {

        // The 'deleteUser' method should actually remove the user from the database.
        it('should remove specified user from database.', async () => {

            // Create a user and put them in the database.
            const userData: models.User = models.User.generateRandomUser();
            const user = new UserType(userData);
            await user.save();

            // Remove the user by id.
            await appDB.deleteUser(userData.id);

            // The user should no longer exist.
            const queryResult = await UserType.findOne({id: userData.id}).cursor().next();
            chai.expect(queryResult).to.be.null;
        });

        // The 'deleteUser' method should not remove more than one record from the database.
        it('should only remove one record from the database.', async () => {

            // Create two users and put them in the database.
            const userData: models.User = models.User.generateRandomUser();
            const user1 = new UserType(userData);
            await user1.save();

            const user2 = new UserType(models.User.generateRandomUser());
            await user2.save();

            // Count the number of users that are in the collection.
            const userCount: number = await UserType.count({});

            // Remove the user by id.
            await appDB.deleteUser(userData.id);

            // The number of users should be 1 less than the number at the start of the method.
            const newUserCount: number = await UserType.count({});
            chai.expect(newUserCount).to.equal(userCount - 1);
        });
    });

    // Tests for BusTrackerDB's 'getUser' method.
    describe('#getUser', () => {

        // The get user method should succeed and find the same user data as was added to the database.
        it('should succeed and return all the user data given their id.', async () => {

            // Create a user.
            const userData: models.User = models.User.generateRandomUser();
            const user = new UserType(userData);
            await user.save();

            // This should get the appropriate user given their id.
            const result: TypedResult<models.User> = await appDB.getUser(userData.id);

            chai.expect(result.success).to.be.true;
            chai.assert(result.data != null && result.data != undefined);

            // Remove extra properties before comparison.
            const resultUser: models.User = new models.User();
            copyInCommonProperties(result.data, resultUser);

            chai.expect(equal(resultUser, userData)).to.be.true;
        });

        // The get user method should return null if the user's id does not exist.
        it('should fail and return null if the user\'s id does not exist.', async () => {

            // This should return a failing result with the data set to null.
            const result: TypedResult<models.User> = await appDB.getUser('invalid_user_id');

            chai.expect(result.success).to.be.false;
            chai.expect(result.data).to.be.null;
        });
    });

    // Tests for BusTrackerDB's 'toggleAdminRights' method.
    describe('#toggleAdminRights', () => {

        // The 'grantAdminRights' method should succeed if the user trying to grant access has admin rights.
        it('should succeed if the user modifying admin rights has admin rights.', async () => {

            // Create a user, with admin rights.
            const userData1: models.User = models.User.generateRandomUser();
            userData1.isAdmin = true;
            const user1 = new UserType(userData1);
            await user1.save();

            // Create another user, who does not have admin rights by default.
            const userData2: models.User = models.User.generateRandomUser();
            userData2.isAdmin = false;
            const user2 = new UserType(userData2);
            await user2.save();

            // Have user1 attempt to give user2 admin rights.
            const result: Result = await appDB.toggleAdminRights(userData1.id, userData2.id, true);

            // The operation should succeed.
            chai.expect(result.success).to.be.true;
        });

        // The 'toggleAdminRights' method should fail if the user does not already have admin rights.
        it('should fail if the user attempting to modify admin rights does not have admin rights.', async () => {

            // Create a user, who doesn't have admin rights.
            const userData1: models.User = models.User.generateRandomUser();
            userData1.isAdmin = false;
            const user1 = new UserType(userData1);
            await user1.save();

            // Create another user, who does not have admin rights by default.
            const userData2: models.User = models.User.generateRandomUser();
            userData2.isAdmin = false;
            const user2 = new UserType(userData2);
            await user2.save();

            // Have user1 attempt to give user2 admin rights.
            const result: Result = await appDB.toggleAdminRights(userData1.id, userData2.id, true);

            // The operation should fail.
            chai.expect(result.success).to.be.false;
        });

        // The 'toggleAdminRights' method should actually change the admin rights of the target user if
        // the granting user has admin rights.
        it('should actually grant the target user admin rights.', async () => {

            // Create a user, with admin rights.
            const userData1: models.User = models.User.generateRandomUser();
            userData1.isAdmin = true;
            const user1 = new UserType(userData1);
            await user1.save();

            // Create another user, who does not have admin rights.
            const userData2: models.User = models.User.generateRandomUser();
            userData2.isAdmin = false;
            const user2 = new UserType(userData2);
            await user2.save();

            // Have user1 attempt to give user2 admin rights.
            await appDB.toggleAdminRights(userData1.id, userData2.id, true);

            // The second user should have admin rights.
            let locatedUser: models.User = await UserType.findOne({ id: userData2.id }).lean().cursor().next();
            chai.expect(locatedUser.isAdmin).to.be.true;

            // Now, have user1 attempt to remove user2's admin rights.
            await appDB.toggleAdminRights(userData1.id, userData2.id, false);

            // The second user should no longer have admin rights.
            locatedUser = await UserType.findOne({ id: userData2.id }).lean().cursor().next();
            chai.expect(locatedUser.isAdmin).to.be.false;
        });
    });

    after(async () => {

        // Ensure the connection to MongoDB is closed so Mocha doesn't hang.
        const conn: mongoose.Connection = mongoose.connection;
        if (conn.readyState == 1) {

            await conn.db.dropDatabase();
            await conn.close();
            const readyState = conn.readyState;
        }
    });
});