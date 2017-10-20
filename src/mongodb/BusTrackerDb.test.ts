import * as assert from 'assert';
import * as sinon from 'sinon';
import * as mongo from 'mongodb';
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
import * as mongoose from 'mongoose';
import { BusTrackerDb } from './BusTrackerDb'

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
    
    before(async () => {

        try {

            await mongoose.connect('mongodb://localhost/BusTrackerTests');
        } catch (err) {

            console.log('Unable to connect to MongoDB for testing.');
        }

        // Make sure the database doesn't exist.
        await mongoose.connection.dropDatabase();
    });

    // Tests for BusTracker Db's 'init' method.
    describe('#init()', () => {

/*         // 'init' should return a failing result if MongoDB is not running.
        it('should throw an error if MongoDB is not running.', async () => {

            // Create a fake MongoDB client.
            sandbox.stub(mongo.MongoClient, 'connect').callsFake((url: string): Promise<mongo.Db> => {
                return new Promise<mongo.Db>((resolve, reject) => {
                    reject('Unable to connect to MongoDb.');
                });
            });

            const db: BusTrackerDb = new BusTrackerDb(new mongo.MongoClient());
            const result = await db.init();

            chai.expect(result.success).to.be.false;

            sandbox.restore();
        }); */

        // BusTrackerDb's 'init' method should create all collections if they are missing.
        it('should create missing collections if they don\'t exist.', async () => {

            // Create a fake Mongo Database instance.
            const fakeDb = <any>sinon.createStubInstance(mongo.Db);
            
            
            // const fakeCursor = sandbox.stub(cursor);

            // The 'collections' method of the Db object should return an empty array.
            const collectionsStub = sandbox.stub(mongo.Db.prototype, 'collections').callsFake((): Promise<any[]> => {
                return new Promise<any[]>((resolve, reject) => {
                    // Return an empty array of collections.
                    resolve([]);
                });
            });

            // The 'listCollections' method of the Db object should return the fake cursor.
            const listCollectionStub = sandbox.stub(mongo.Db.prototype, 'listCollections').callsFake((): mongo.CommandCursor => {

                return cursor;
            });

            // Create a fake MongoDB client that will return the fake Mongo Database instance.
            const connectStub = sandbox.stub(mongo.MongoClient, 'connect').callsFake((url: string): Promise<mongo.Db> => {
                return new Promise<mongo.Db>((resolve, reject) => {
                    resolve(fakeDb);
                });
            });

            const db: BusTrackerDb = new BusTrackerDb(new mongo.MongoClient());
            await db.init();

            // The BusTrackerDb class should have iterated through the list of collections.
            chai.expect(fakeDb.listCollections).to.have.been.called.at.least(1);
            // The BusTrackerDb class should create 1 or more collections.
            chai.expect(fakeDb.createCollection).to.have.been.called.at.least(1);
        });
    });

    // Drop the test database after all Database related tests have run.
    after(() => {

    });
});