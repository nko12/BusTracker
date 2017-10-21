import * as express from 'express';

// Create an Express app instance.
const app = express();

// Set the port Node will listen on to one passed in the commandline or 5000.
const port = process.env.PORT || 5000;

// Set up the '/' endpoint.
app.get('/', (req: express.Request, res: express.Response) => {

    // Respond with "Hello World!";
    res.send('Hello World!');
});

// Begin listening for requests.
app.listen(port, () => {

    console.log(`BusTracker is listening on port ${port}.`);
});