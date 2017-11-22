import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { TypedResult } from '../Result';
import { User } from '../models/User';

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
        const httpLink: HttpLink = new HttpLink({ uri: 'http://localhost:5000/graphql' });

        this.client = new ApolloClient<InMemoryCache>({
            link: httpLink,
            cache: new InMemoryCache() as any
        });
    }

    /**
     * Logs a user into the system. Returns a user object with the user's data.
     * @param username 
     * @param password 
     */
    public async login(username: string, password: string): Promise<TypedResult<User>> {

        const loginQuery = gql`
            query LoginQuery {
                login(username: "${username}", passwordHash: "${md5(password)}")
                {
                    error, id, username, favoriteStopIds, favoriteRouteIds, isAdmin
                }
            }
        `;

        try {
            const queryResult = await this.client.query({ query: loginQuery });
            if (queryResult.data['login']['error']) {
                return new TypedResult(false, null, 'Failed to login user: ' + queryResult.data['login']['error']);
            }
            return new TypedResult(true, <User>queryResult.data['login']);
        } catch (err) {
            return new TypedResult(false, null, 'Failed to register user: ' + JSON.stringify(err));
        }
    }

    /**
     * Registers a new user into the system. Returns a user object with the user's new default data.
     * @param username The username of the user to login.
     * @param password The password of the user to login.
     */
    public async register(username: string, password: string): Promise<TypedResult<User>> {

        const registerQuery = gql`
            mutation RegisterQuery {
                register(username: "${username}", passwordHash: "${md5(password)}")
                {
                    error, id, username, favoriteStopIds, favoriteRouteIds, isAdmin
                }
            }
        `;

        try {
            const queryResult = await this.client.mutate({ mutation: registerQuery });
            if (queryResult.data['register']['error']) {
                return new TypedResult(false, null, 'Failed to register user: ' + queryResult.data['register']['error']);
            }
            return new TypedResult(true, <User>queryResult.data['register']);
        } catch (err) {
            return new TypedResult(false, null, 'Failed to register user: ' + JSON.stringify(err));
        }
    }
}