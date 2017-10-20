import * as assert from 'assert';
import * as sinon from 'sinon';
import * as mongo from 'mongodb';
import { BusTrackerDb } from './BusTrackerDb'

// BusTrackerDb's 'init' method should throw an error if MongoDB is not running.
describe('BusTrackerDb', () => {
    describe('#init()', () => {
        it('should throw an error if MongoDB is not running.', async () => {

            // Create a fake MongoDB client.
            const sandbox: sinon.SinonSandbox = sinon.sandbox.create();

            sandbox.stub(mongo.MongoClient, 'connect').callsFake((url: string): Promise<mongo.Db> => {
                return new Promise<mongo.Db>((resolve, reject) => {
                    reject('Unable to connect to MongoDb.');
                });
            });
            
            const db: BusTrackerDb = new BusTrackerDb(new mongo.MongoClient());
            const result = await db.init();

            assert.equal(result.success, false);
        });
    })
});