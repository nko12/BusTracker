import * as assert from 'assert';
import * as sinon from 'sinon';
import * as mongo from 'mongodb';
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
import * as mongoose from 'mongoose';
import { BusTrackerDb } from './BusTrackerDb'
import { serverConfig } from '../ServerConfig'

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

    // Tests for BusTracker Db's 'init' method.
    describe('#init()', () => {

        // BusTrackerDb's 'init' method should create all collections if they are missing.
        it('should create missing collections if they don\'t exist.', async () => {

            // Create and initialize a connection to the database.
            let conn: mongoose.Connection = mongoose.connection;
            try {
                await mongoose.connect(`mongodb://${serverConfig.dbHost}:${serverConfig.dbPort}/${serverConfig.dbName}`, { useMongoClient: true});
                conn = mongoose.connection;  
            } catch (err) {
                assert(false, 'Test failed to connect to database.');
            }
            
            const db: BusTrackerDb = new BusTrackerDb(conn);
            await db.init();

            // The BusTrackerDb class should have created the missing collections. There should be at least one collection
            // in the test database.
            chai.expect(conn.db.listCollections({}).toArray.length).to.be.greaterThan(0);

            // Drop the database.
            try {
                await conn.db.dropDatabase();
                console.log('Successfully dropped database from test.');
            }
            catch (err) {
                assert(false, 'Test failed to drop test database.');
            }
            finally {
                await conn.close();
            }
        });
    });
});