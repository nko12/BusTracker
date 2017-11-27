import { BusTrackerServer } from './BusTrackerServer';

// Create the BusTrackerServer object, initialize it, and then start it.
const server: BusTrackerServer = new BusTrackerServer();
server.init().then(() => {

    server.start();
}).catch((err) => {

    console.log('An error occurred during server initialization. Server is unable to start.');
    console.log(`Error Object: ${err}`);
    process.exit();
});