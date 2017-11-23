import { BusTrackerServer } from './BusTrackerServer';
import { BusTimeApi } from './BusTimeApi';
var { buildSchema } = require('graphql');
import { Result, TypedResult } from './Result';
import * as models from './Models';


/*    GraphQL request/response classes    */


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
 * Represents the object sent to the client for GraphQL to represent an id
 */
class GraphQLIDResponse implements IError {
  error?: string;
  id: string;
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

class GraphQLRouteArray implements IError {
  error?: string;
  routes?: Array<models.Route>;
}

class GraphQLBusStopArray implements IError {
  error?: string;
  stops?: Array<models.BusStop>;
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
interface IDQueryData {
  id: string;
}

/**
 * Represents the object sent from the client for an id update (route or stop favorite update)
 */
interface IDArrayMutationData {
  userId: string;
  objectIds: Array<string>;
}

/**
 * Represents the object sent from the client for toggling admin rights
 */
interface AdminRightsMutationData {
  grantingId: string;
  targetId: string;
  adminStatus: boolean;
}

/**
 * Represents the object sent from the client for removing an object (route or stop)
 */
interface RemoveIDMutationData {
  userId: string;
  objectId: string;
}

/**
 * Represents the object sent from the client for adding a fake route
 */
class AddRouteMutationData extends models.Route {
  userId: string;
}

/**
 * Represents the object sent from the client for adding a fake stop
 */
interface AddBusStopMutationData extends models.BusStop {
  userId: string;
}

interface GetObjectsNearPositionMutationData {
  latitude: number,
  longitude: number
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

    private readonly busApi: BusTimeApi;

    /**
     * Creates a new instance of the GraphQLHandler class.
     * @param server The server object to use.
     */
    public constructor(server: BusTrackerServer) {
        this.server = server;
        this.busApi = new BusTimeApi(this.server.storage);
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

        type IDResponse implements IError {
          error: String
          id: String
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

        type RouteArray implements IError {
          error: String
          routes: [Route]
        }

        type BusStopArray implements IError {
          error: String
          stops: [BusStop]
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
          getRoutesNearLocation(latitude: Float, longitude: Float): RouteArray
          getBusStopsNearLocation(latitude: Float, longitude: Float): BusStopArray
        }

        type Mutation {
          register(username: String, passwordHash: String): User
          toggleAdminRights(grantingId: String, targetId: String, adminStatus: Boolean): BasicResponse
          editFavoriteBusStopIDs(userId: String, objectIds: [String]): BasicResponse
          editFavoriteRouteIDs(userId: String, objectIds: [String]): BasicResponse
          addNewRoute(userId: String, id: String, name: String, polyline: String, busStopIDs: [String]): IDResponse
          addNewBusStop(userId: String, id: String, name: String, latitude: String, longitude: String): IDResponse
          removeRoute(userId: String, objectId: String): BasicResponse
          removeBusStop(userId: String, objectId: String): BasicResponse
          deleteUser(id: String): BasicResponse
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
    public async getRoute(data: IDQueryData): Promise<GraphQLRoute> {

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
    public async getStop(data: IDQueryData): Promise<GraphQLBusStop> {

      let stop: GraphQLBusStop = new GraphQLBusStop();

      const result = await this.server.storage.getBusStop(data.id);
      if (!result.success) {
          stop.error = result.message;
          return stop;
      }

      stop = <GraphQLBusStop> result.data;
      return stop;
    }

    public async getRoutesNearLocation(data: GetObjectsNearPositionMutationData): Promise<GraphQLRouteArray> {

      let routes: GraphQLRouteArray = new GraphQLRouteArray();

      const result = await this.busApi.GetRoutesNearPosition(data.latitude, data.longitude);
      if (!result.success) {
        routes.error = result.message;
        return routes;
      }

      routes.routes = <Array<models.Route>> result.data;
      return routes;
    }

    public async getBusStopsNearLocation(data: GetObjectsNearPositionMutationData): Promise<GraphQLBusStopArray> {
      let stops: GraphQLBusStopArray = new GraphQLBusStopArray();

      const result = await this.busApi.GetBusStopsNearPosition(data.latitude, data.longitude);
      if (!result.success) {
        stops.error = result.message;
        return stops;
      }

      stops.stops = <Array<models.BusStop>> result.data;
      return stops;
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
     * Handler that deals with the toggleAdminRights mutation.
     * @param data The toggleAdminRights data passed from the client.
     */
    public async toggleAdminRights(data: AdminRightsMutationData): Promise<GraphQLBasicResponse> {

      let response: GraphQLBasicResponse = new GraphQLBasicResponse();

      const result = await this.server.storage.toggleAdminRights(data.grantingId, data.targetId, data.adminStatus);
      if (!result.success) {
          response.error = result.message;
      }
      return response;
    }

    /**
     * Handler that deals with the editFavoriteBusStopIDs mutation.
     * @param data The bus stop ids and user data passed from the client.
     */
    public async editFavoriteBusStopIDs(data: IDArrayMutationData): Promise<GraphQLBasicResponse> {

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
    public async editFavoriteRouteIDs(data: IDArrayMutationData): Promise<GraphQLBasicResponse> {

      let response: GraphQLBasicResponse = new GraphQLBasicResponse();

      const result = await this.server.storage.editFavoriteRouteIDs(data.userId, data.objectIds);
      if (!result.success) {
          response.error = result.message;
      }
      return response;
    }


    /**
     * Handler that deals with the addNewRoute mutation.
     * @param data The route to create and user id
     */
    public async addNewRoute(data: AddRouteMutationData): Promise<GraphQLIDResponse> {

      let response: GraphQLIDResponse = new GraphQLIDResponse();

      const result = await this.server.storage.addNewRoute(data.userId, data);
      if (!result.success) {
          response.error = result.message;
          return response;
      }
      response.id = <string>result.data;
      return response;
    }

    /**
     * Handler that deals with the addNewBusStop mutation.
     * @param data The stop to create and user id
     */
    public async addNewBusStop(data: AddBusStopMutationData): Promise<GraphQLIDResponse> {

      let response: GraphQLIDResponse = new GraphQLIDResponse();

      const result = await this.server.storage.addNewBusStop(data.userId, data);
      if (!result.success) {
          response.error = result.message;
          return response;
      }
      response.id = <string>result.data;
      return response;
    }

    /**
     * Handler that deals with the removeRoute mutation.
     * @param data The user id and route id to remove
     */
    public async removeRoute(data: RemoveIDMutationData): Promise<GraphQLBasicResponse> {

      let response: GraphQLBasicResponse = new GraphQLBasicResponse();

      const result = await this.server.storage.removeRoute(data.userId, data.objectId);
      if (!result.success) {
          response.error = result.message;
      }
      return response;
    }

    /**
     * Handler that deals with the removeBusStop mutation.
     * @param data The user id and route id to remove
     */
    public async removeBusStop(data: RemoveIDMutationData): Promise<GraphQLBasicResponse> {

      let response: GraphQLBasicResponse = new GraphQLBasicResponse();

      const result = await this.server.storage.removeBusStop(data.userId, data.objectId);
      if (!result.success) {
          response.error = result.message;
      }
      return response;
    }

    /**
     * Handler that deals with the deleteUser mutation.
     * @param data The user id to delete
     */
    public async deleteUser(data: IDQueryData): Promise<GraphQLBasicResponse> {

      let response: GraphQLBasicResponse = new GraphQLBasicResponse();

      const result = await this.server.storage.deleteUser(data.id);
      if (!result.success) {
          response.error = result.message;
      }
      return response;
    }
}

export {GraphQLHandler}
