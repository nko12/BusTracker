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
import { copyInCommonProperties }from '../Util'

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
})

// A variable for ensuring each id used in tests is unique.
let nextId = 0;

// Tests for BusTrackerDb.
describe('BusTrackerDb', () => {

    before((done) => {

        // Create and initialize a connection to the database.
        let conn: mongoose.Connection = mongoose.connection;
        try {
            mongoose.connect(`mongodb://${serverConfig.dbHost}:${serverConfig.dbPort}/${serverConfig.dbName}`, { useMongoClient: true });
            conn = mongoose.connection;
            conn.once('open', () => {
                done();
            });
        } catch (err) {
            assert(false, 'Test failed to connect to database. ' + JSON.stringify(err));
        }
    });

    // Tests for BusTrackerDb's 'init' method.
    describe('#init', () => {

        // BusTrackerDb's 'init' method should create all collections if they are missing.
        it('should create missing collections if they don\'t exist.', async () => {

            const conn: mongoose.Connection = mongoose.connection;

            const db: BusTrackerDb = new BusTrackerDb(conn);
            chai.expect((await db.init()).success).to.be.true;

            // The BusTrackerDb class should have created the missing collections. There should be at least one collection
            // in the test database.
            const cursor = conn.db.listCollections({});
            const collections = await cursor.toArray();
            chai.expect(collections.length).to.be.greaterThan(0);
        });
    });

    // Tests for BusTrackerDb's 'verifyEmail' method.
    describe('#verifyEmail', () => {

        // BusTrackerDb's 'verifyEmail' method should fail if a user with the same email adready exists.
        it('should fail if a user with the same email already exists.', async () => {

            const testEmail: string = 'joe.schmoe@outlook.com';

            // Create a user to put in User database.
            const user1 = new UserType({
                id: nextId++,
                firstName: 'Joe',
                lastName: 'Schmoe',
                email: testEmail,
                passwordHash: '3b1a3a41b2c227f4800d1e04fbff1473',
                favoriteStopIds: [],
                favoriteRouteIds: []
            });
            await user1.save();

            // Create the BusTrackerDb instance and initialize it.
            const appDb: BusTrackerDb = new BusTrackerDb(mongoose.connection);
            await appDb.init();

            // Verify an email address.
            const result: TypedResult<boolean> = await appDb.verifyEmail(testEmail);

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
            const user: models.User = {
                id: nextId++,
                firstName: 'Nkosi',
                lastName: 'Dean',
                email: 'nkosi.dean343@outlook.com',
                passwordHash: 'f845f1c938311d352d22042ea69e9458',
                favoriteStopIds: [],
                favoriteRouteIds: []
            };

            // Attempt to register this new user.
            const appDb: BusTrackerDb = new BusTrackerDb(mongoose.connection);
            await appDb.init();

            const result: Result = await appDb.registerUser(user);

            // Registration of the user should be successful.
            chai.expect(result.success).to.be.true;

            // The database should now have a user with all the matching properties.
            const locatedUser = await UserType.findOne({id: user.id}).lean().cursor().next();

            // The user should have been created in the database. The query above should have found it.
            chai.expect(locatedUser).to.not.be.null;

            // Remove extra properties before comparison.
            const resultUser: models.User = new models.User();
            copyInCommonProperties(locatedUser, resultUser);

            // The two user objects should be equal.
            chai.expect(equal(resultUser, user)).to.be.true;
        });

        // BusTrackerDb's 'registerUser' method should fail if a user with the same email already exists.
        it('should fail if a user with the same email already exists.', async () => {

            // Create a user to put in the database.
            const user1 = new UserType({
                id: nextId++,
                firstName: 'Dennis',
                lastName: 'Menace',
                email: 'dennis.menace@outlook.com',
                passwordHash: '3b1a3a41b2c227f4800d1e04fbff1473',
                favoriteStopIds: [],
                favoriteRouteIds: []
            });

            await user1.save();

            const appDb: BusTrackerDb = new BusTrackerDb(mongoose.connection);
            await appDb.init();

            // Attempt to register a new user with different properties except the email is the same.
            const user2: models.User = {
                id: nextId++,
                firstName: 'Jane',
                lastName: 'Dane',
                email: 'dennis.menace@outlook.com',
                passwordHash: '0341628fe30bb77bfd671cc5571eeb2d',
                favoriteStopIds: [],
                favoriteRouteIds: []
            };

            const result: Result = await appDb.registerUser(user2);

            // The register operation should fail.
            chai.expect(result.success).to.be.false;
        });
    });

    after(async () => {

        // Ensure the connection to MongoDB is closed so Mocha doesn't hang.
        const conn: mongoose.Connection = mongoose.connection;
        await conn.db.dropDatabase();
        await conn.close();
    });
});