import { BusTrackerServer } from './BusTrackerServer';
var { buildSchema } = require('graphql');


/**
 * Represents the object sent to the client with GraphQL to represent the user
 */
interface GraphQLUser {
  id: string;
  name: string;
}

/**
 * Represents the object sent from the client with GraphQL to represent login info
 */
interface LoginQueryData {
  username: string;
  password: string;
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
      var handler = this;
      this.schema = buildSchema(`
        type User {
          id: String
          name: String
        }

        type Query {
          login(username: String, password: String): User
        }
      `);
    }
    public login(data: LoginQueryData): GraphQLUser {
      console.log("GraphQL login attempt: {username=" + data.username + ",password=" + data.password + "}");
      return {
        id: "8675309",
        name: "TestName"
      };
    }
}

export {GraphQLHandler, GraphQLUser}
