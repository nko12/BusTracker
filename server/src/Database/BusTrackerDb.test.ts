import * as assert from 'assert';
import * as sinon from 'sinon';
import * as mongo from 'mongodb';
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
import * as mongoose from 'mongoose';
var equal = require('deep-equal');

import * as models from '../Models';
import { Schemas, UserType, BusTrackerDb } from '../Database'
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

// Tests for BusTrackerDb's Initialization method.
describe('BusTrackerDb Initialization', () => {

    // BusTrackerDb's 'init' method should create all collections if they are missing.
    it('should create missing collections if they don\'t exist.', (done) => {

        // Create and initialize a connection to the database.
        mongoose.connect(`mongodb://${serverConfig.dbHost}:${serverConfig.dbPort}/${serverConfig.dbName}`, { useMongoClient: true });
        mongoose.connection.once('open', async () => {
            
            const conn: mongoose.Connection = mongoose.connection;
            const db: BusTrackerDb = new BusTrackerDb(conn);
            await db.init();

            // The BusTrackerDb class should have created the missing collections. There should be at least one collection
            // in the test database.
            const cursor = conn.db.listCollections({});
            const collections = await cursor.toArray();
            chai.expect(collections.length).to.be.greaterThan(0);

            done();
        });
    });
});

// Tests for BusTrackerDb.
describe('BusTrackerDb', () => {

    // The bus tracker database instance that all the tests will use. It is initialized before tests use it, as they
    // all assume it has been initialized.
    let appDb: BusTrackerDb;

    before((done: MochaDone) => {

        function initBusTrackerDbCallback() {

            // Initailization the BusTrackerDb object.
            appDb = new BusTrackerDb(mongoose.connection);
            appDb.init().then(() => {
                // End test bootstrap.
                done();
            }).catch((err) => {
                
                // Rethrow the error.
                throw err;
            });
        }

        // Create and initialize a connection to the database. (1 = connected)
        if (mongoose.connection.readyState == 1) {

            initBusTrackerDbCallback();          
        } else {

            mongoose.connect(`mongodb://${serverConfig.dbHost}:${serverConfig.dbPort}/${serverConfig.dbName}`, { useMongoClient: true });        
            mongoose.connection.once('open', () => {

                initBusTrackerDbCallback(); 
            });
        }    
    });

    // Tests for BusTrackerDb's 'verifyEmail' method.
    describe('#verifyEmail', () => {

        // BusTrackerDb's 'verifyEmail' method should fail if a user with the same email adready exists.
        it('should fail if a user with the same email already exists.', async () => {

            // Create a user to put in User database.
            const userData = models.User.generateRandomUser();
            const user1 = new UserType(userData);
            await user1.save();

            // Verify an email address.
            const result: TypedResult<boolean> = await appDb.verifyEmail(userData.email);

            // Since that email address already exists, BusTrackerDb should have returned an error.
            chai.assert(result.success);
            chai.expect(result.data).to.be.false;
        });
    })

    // Tests for BusTrackerDb's 'registerUser' method.
    describe('#registerUser', () => {

        // BusTrackerDb's 'registerUser' method should successfully create a new user in the database.
        it('should add a new user into the database with matching properties.', async () => {

            // Create a user to put in the database.
            const userData = models.User.generateRandomUser();

            // Attempt to register a new user.
            const result: Result = await appDb.registerUser(userData);

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

        // BusTrackerDb's 'registerUser' method should fail if a user with the same email already exists.
        it('should fail if a user with the same email already exists.', async () => {

            // Create a user to put in the database.
            const firstUserData: models.User = models.User.generateRandomUser();
            const firstUser = new UserType(firstUserData);
            await firstUser.save();

            // Create a new user with different properties except the email is the same.
            const secondUserData: models.User = models.User.generateRandomUser();
            secondUserData.email = firstUserData.email;

            // Attempt to register the new user who has the same email as the first.
            const result: Result = await appDb.registerUser(secondUserData);

            // The register operation should fail.
            chai.expect(result.success).to.be.false;
        });
    });

    // Tests for BusTrackerDb's '' method.
    describe('#deleteUser', () => {

        // The 'deleteUser' method should actually remove the user from the database.
        it('should remove specified user from database.', async () => {

            // Create a user and put them in the database.
            const userData: models.User = models.User.generateRandomUser();
            const user = new UserType(userData);
            await user.save();

            // Remove the user by email.
            await appDb.deleteUser(userData.email);

            // The user should no longer exist.
            const queryResult = await UserType.findOne({id: user.id}).cursor().next();
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

            // Remove the user by email.
            await appDb.deleteUser(userData.email);

            // The number of users should be 1 less than the number at the start of the method.
            const newUserCount: number = await UserType.count({});
            chai.expect(newUserCount).to.equal(userCount - 1);
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