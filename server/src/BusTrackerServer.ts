import * as express from 'express';

import { Result } from './Result'
import { BusTrackerDB } from './Database';
import { serverConfig } from './ServerConfig';
import { realTimeInit } from './RealtimeBusTracker'

/**
 * Represents the primary class that handles most of the logic of the Bus Tracker server application.
 */
export class BusTrackerServer {

    /**
     * Represents the persistent storage component of the BusTrackerServer.
     */
    private readonly storage: BusTrackerDB;

    /**
     * Represents the underlying Express application that drives much of the very low level server logic.
     */
    private readonly app: express.Application;

    /**
     * Creates a new instance of the BusTracker server.
     */
    public constructor() {

        this.storage = new BusTrackerDB();
        this.app = express();
    }

    /**
     * Attempts to initialize the server, which initializes the various components of the server. If any of them
     * fail, server initailization fails.
     * @returns A promise object.
     */
    public async init(): Promise<void> {

        let result: Result;

        try {

            // Initialize the database component.
            await this.storage.init();

            // Initialize the realtime tracking.
            realTimeInit();

            // Set up the '/' endpoint. For now, it will just print a simple string to demonstrate the server
            // is running.
            this.app.get('/', (req: express.Request, res: express.Response) => {

                // Respond with a simple string.
                res.send('BusTracker Server');

            });

        } catch (err) {

            // A component failed to initialization successfully.
            console.log(`Server initialization failed. ${err}`);
        }
    }

    /**
     * Causes the BusTrackerServer object to listen to requests on the set port.
     */
    public start(): void {

        // Begin listening for requests.
        try {
            this.app.listen(serverConfig.serverPort, () => {

                console.log(`BusTracker server started and listening on port ${serverConfig.serverPort}.`);
            });
        } catch (err) {
            console.log('Error on listen: ' + JSON.stringify(err));
        }

    }
}