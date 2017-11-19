import { BusTrackerServer } from './BusTrackerServer';
var { buildSchema } = require('graphql');
import { Result, TypedResult } from './Result';
import * as models from './Models';


/**
 * Represents the basic error interface for GraphQL responses
 */
interface IError {
  error?: string;
}

/**
 * Represents the object sent to the client for GraphQL to represent only a failure/success response
 */
class GraphQLBasicResponse implements IError {
  error?: string;
}

/**
 * Represents the object sent to the client with GraphQL to represent the user
 */
class GraphQLUser extends models.User implements IError {
  error?: string;
}

/**
 * Represents the object sent to the client with GraphQL to represent a Route
 */
class GraphQLRoute extends models.Route implements IError {
  error?: string;
}

/**
 * Represents the object sent to the client with GraphQL to represent a BusStop
 */
class GraphQLBusStop extends models.BusStop implements IError {
  error?: string;
}

/**
 * Represents the object sent from the client with GraphQL to represent login info
 */
interface LoginQueryData {
  username: string;
  passwordHash: string;
}

/**
 * Represents the object sent from the client for an id query (route or stop)
 */
interface IdQueryData {
  id: string;
}
/**
 * Represents the object sent from the client for an id update (route or stop favorite update)
 */
interface IdArrayMutationData {
  userId: string
  objectIds: Array<string>;
}

/**
 * Represents the GraphQL handling component of the server.
 */
class GraphQLHandler {
    /**
     * Represents the central part of the server which handles communication between components
     */
    public server: BusTrackerServer;

    /**
     * Represents the GraphQL schema object, used when creating GraphQL endpoint
     * The type should be GraphQLSchema but importing @types/graphql has issues
     */
    public schema: any;

    /**
     * Creates a new instance of the GraphQLHandler class.
     * @param server The server object to use.
     */
    public constructor(server: BusTrackerServer) {
        this.server = server;
    }

    /**
     * Initializes the schema data.
     */
    public init(): void {
      this.schema = buildSchema(`
        interface IError {
          error: String
        }

        type BasicResponse implements IError {
          error: String
        }

        type User implements IError {
          error: String
          id: String
          username: String
          favoriteStopIds: [String]
          favoriteRouteIds: [String]
          isAdmin: Boolean
        }

        type Route implements IError {
          error: String
          id: String
          name: String
          polyline: String
          busStopIDs: [String]
        }

        type BusStop implements IError {
          error: String
          id: String
          name: String
          latitude: String
          longitude: String
        }

        type Query {
          login(username: String, passwordHash: String): User
          getRoute(id: String): Route
          getStop(id: String): BusStop
        }

        type Mutation {
          register(username: String, passwordHash: String): User
          toggleAdminRights(grantingId: String, targetId: String, adminStatus: Boolean): BasicResponse
          editFavoriteBusStopIDs(userId: String, objectIds: [String]): BasicResponse
          editFavoriteRouteIDs(userId: String, objectIds: [String]): BasicResponse
          addNewRoute(userId: String, routeData: Route): BasicResponse
          addNewBusStop(userId: String, stopData: BusStop): BasicResponse
          removeRoute(userId: String, routeId: String): BasicResponse
          removeBusStop(userId: String, stopId: String): BasicResponse
        }
      `);
    }

    /**    Queries     */

    /**
     * Handler that deals with the login query.
     * @param data The login data passed from the client.
     */
    public async login(data: LoginQueryData): Promise<GraphQLUser> {
      let user: GraphQLUser = new GraphQLUser();

      const result = await this.server.storage.loginUser(data.username, data.passwordHash);
      if (!result.success) {
          // Failed to login the user.
          user.error = result.message;
          return user;
      }

      user = <GraphQLUser> result.data;
      return user;
    }

    /**
     * Handler that deals with the getRoute query.
     * @param data The id for the route to lookup.
     */
    public async getRoute(data: IdQueryData): Promise<GraphQLRoute> {

      let route: GraphQLRoute = new GraphQLRoute();

      const result = await this.server.storage.getRoute(data.id);
      if (!result.success) {
          route.error = result.message;
          return route;
      }

      route = <GraphQLRoute> result.data;
      return route;
    }

    /**
     * Handler that deals with the getStop query.
     * @param data The id for the stop to lookup.
     */
    public async getStop(data: IdQueryData): Promise<GraphQLBusStop> {

      let stop: GraphQLBusStop = new GraphQLBusStop();

      const result = await this.server.storage.getBusStop(data.id);
      if (!result.success) {
          stop.error = result.message;
          return stop;
      }

      stop = <GraphQLBusStop> result.data;
      return stop;
    }


    /*     Mutations    */

    /**
     * Handler that deals with the register mutation.
     * @param data The register data (same form as login data) passed from the client.
     */
    public async register(data: LoginQueryData): Promise<GraphQLUser> {

      let user: GraphQLUser = new GraphQLUser();

      const result = await this.server.storage.registerUser(data.username, data.passwordHash);
      if (!result.success) {
          user.error = result.message;
          return user;
      }

      user = <GraphQLUser> result.data;
      return user;
    }

    /**
     * Handler that deals with the editFavoriteBusStopIDs mutation.
     * @param data The bus stop ids and user data passed from the client.
     */
    public async editFavoriteBusStopIDs(data: IdArrayMutationData): Promise<GraphQLBasicResponse> {

      let response: GraphQLBasicResponse = new GraphQLBasicResponse();

      const result = await this.server.storage.editFavoriteBusStopIDs(data.userId, data.objectIds);
      if (!result.success) {
          response.error = result.message;
      }
      return response;
    }

    /**
     * Handler that deals with the editFavoriteRouteIDs mutation.
     * @param data The route ids and user data passed from the client.
     */
    public async editFavoriteRouteIDs(data: IdArrayMutationData): Promise<GraphQLBasicResponse> {

      let response: GraphQLBasicResponse = new GraphQLBasicResponse();

      const result = await this.server.storage.editFavoriteRouteIDs(data.userId, data.objectIds);
      if (!result.success) {
          response.error = result.message;
      }
      return response;
    }
}

export {GraphQLHandler}
