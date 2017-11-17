import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import gql from 'graphql-tag';
import * as md5 from 'md5';

/**
 * Represents the connection that allows the client to communicate to the server.
 */
export class BusTrackerApi {

    private readonly client: ApolloClient<InMemoryCache>;
    /**
     * Creates a new instance of the BusTrackerApi class.
     */
    public constructor() {
        const httpLink: HttpLink = new HttpLink({uri: 'http://localhost:5000/graphql'});

        this.client = new ApolloClient<InMemoryCache>({
            link: httpLink,
            cache: new InMemoryCache() as any
        });
    }

    /**
     * Uses a username and password to login user. Returns a user object with the
     * user's data.
     * @param username 
     * @param password 
     */
    public async login(username: string, password: string): Promise<{}> {

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
            return null;
        }
    }
}