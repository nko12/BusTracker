import ApolloClient, { createNetworkInterface } from 'apollo-client';
import gql from 'graphql-tag';
import * as md5 from 'md5';

/**
 * Represents the connection that allows the client to communicate to the server.
 */
export class BusTrackerApi {

    private readonly client: ApolloClient;
    /**
     * Creates a new instance of the BusTrackerApi class.
     */
    public constructor() {
        this.client = new ApolloClient({
            networkInterface: createNetworkInterface({uri: 'localhost:5000/graphql'})
        });
    }

    /**
     * Uses a username and password to login user. Returns a user object with the
     * user's data.
     * @param username 
     * @param password 
     */
    public async login(username: string, password: string): Promise<{} | null> {

        const loginQuery = gql`
            query LoginQuery {
                login(username: ${username}, passwordHash: ${md5(password)})
                {
                    id, username, error
                }
            }
        `;

        try {
            const data = await this.client.query({query: loginQuery});
            return data;
        } catch (err) {
            alert(JSON.stringify(err));
            return null;
        }
    }
}