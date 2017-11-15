import { BusTrackerServer } from './BusTrackerServer';
var { buildSchema } = require('graphql');
import { Result, TypedResult } from './Result';
import * as models from './Models';


/**
 * Represents the object sent to the client with GraphQL to represent the user
 */
interface GraphQLUser {
  id?: string;
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
    public constructor(server: BusTrackerServer) {
        this.server = server;
    }
    public init(): void {
      this.schema = buildSchema(`
        type User {
          id: String
          name: String
        }

        type Query {
          login(username: String, passwordHash: String): User
        }
      `);
    }
    public login(data: LoginQueryData): GraphQLUser {
      console.log("GraphQL login attempt: {username=" + data.username + ",password=" + data.passwordHash + "}");
      this.server.storage.loginUser(data.username, data.passwordHash).then((res: TypedResult<models.User>) => {
        console.log("Got data");
        //if (res.success && res.data) {
          return {
            id: "testid" // res.data.id
          };
      //  return {
      //    error: "error" // res.message
      //  };
      }).catch((error) => {
        console.log("Error in GraphQL login: ", error);
      });
      return {id: "test"};
    }
}

export {GraphQLHandler, GraphQLUser}
