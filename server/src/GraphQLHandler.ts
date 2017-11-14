import { BusTrackerServer } from './BusTrackerServer';

/**
 * Represents the GraphQL handling component of the server.
 */
class GraphQLHandler {
    /**
     * Represents the central part of the server which handles communication between components
     */
    public server: BusTrackerServer;
    public constructor(server: BusTrackerServer) {
        this.server = server;
    }
    public init(): void {

    }
}

export {GraphQLHandler}
