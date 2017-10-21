import * as assert from 'assert';
import * as sinon from 'sinon';
import * as mongo from 'mongodb';
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
import * as mongoose from 'mongoose';

import { Schemas } from './DbSchemas'
import { BusTrackerDb } from './BusTrackerDb'
import { serverConfig } from '../ServerConfig'

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
    describe('#init()', () => {

        // BusTrackerDb's 'init' method should create all collections if they are missing.
        it('should create missing collections if they don\'t exist.', async () => {

            const conn: mongoose.Connection = mongoose.connection;

            const db: BusTrackerDb = new BusTrackerDb(mongoose.connection);
            chai.expect((await db.init()).success).to.be.true;

            // The BusTrackerDb class should have created the missing collections. There should be at least one collection
            // in the test database.
            const cursor = conn.db.listCollections({});
            const collections = await cursor.toArray();
            console.log('Database Name: ' + conn.db.databaseName);
            chai.expect(collections.length).to.be.greaterThan(0);
        });
    });

    after(async () => {

        // Ensure the connection to MongoDB is closed so Mocha doesn't hang.
        const conn: mongoose.Connection = mongoose.connection;
        await conn.db.dropDatabase();
        await conn.close();
    })
});