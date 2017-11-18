import { BusTrackerServer } from './BusTrackerServer';
var { buildSchema } = require('graphql');
import { Result, TypedResult } from './Result';
import * as models from './Models';

/**
 * Represents the object sent to the client with GraphQL to represent the user
 */
class GraphQLUser extends models.User {
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

          type User implements IError {
            id: String
            error: String
            username: String
            favoriteStopIds: [String]
            favoriteRouteIds: [String]
            isAdmin: Boolean
        }

        type Query {
          login(username: String, passwordHash: String): User
        }

        type Mutation {
          register(username: String, passwordHash: String): User
        }
      `);
    }

    /**
     * Handler that deals with the login query.
     * @param data The login data passed from the client.
     */
    public async login(data: LoginQueryData): Promise<GraphQLUser> {
      let user: GraphQLUser = new GraphQLUser();
      
      const result = await this.server.storage.loginUser(data.username, data.passwordHash);
      if (!result.success)
      {
          // Failed to login the user.
          user.error = result.message;
          return user;
      }

      user = <GraphQLUser> result.data;
      return user;
    }

    /**
     * Handler that deals with the register mutation.
     * @param data The register data (same form as login data) passed from the client.
     */
    public async register(data: LoginQueryData): Promise<GraphQLUser> {
      
      let user: GraphQLUser = new GraphQLUser();
      
      const result = await this.server.storage.registerUser(data.username, data.passwordHash);
      if (!result.success)
      {
          // Failed to register the user.
          user.error = result.message;
          return user;
      }

      user = <GraphQLUser> result.data;
      return user;
    }
}

export {GraphQLHandler, GraphQLUser}
