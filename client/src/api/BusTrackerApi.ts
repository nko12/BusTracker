import * as polyline from 'polyline';
import gql from 'graphql-tag';
import { ExecutionResult } from 'graphql/execution/execute'
import { ApolloClient, ApolloError } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { Coords } from 'google-map-react';
import { TypedResult, Result } from '../Result';
import { User } from '../models/User';
import { Stop } from '../models/Stop';
import { Route } from '../models/Route';

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
	 * @param username The username of the user.
	 * @param passwordHash The password hash for the user. This will be hashed before being sent to server.
	 * @returns A TypedResult containing the user data for the new user.
	 */
    public async login(username: string, passwordHash: string): Promise<TypedResult<User>> {
        const query = gql`
			query LoginQuery {
				login(username: "${username}", passwordHash: "${passwordHash}") {
					error, id, username, favoriteStopIds, favoriteRouteIds, isAdmin
				}
			}
		`;
        return await this.makeGraphQLRequest<User>(query, 'login', false, true);
    }

	/**
	 * Registers a new user into the system. Returns a user object with the user's new default data.
	 * @param username The username of the user to login.
	 * @param passwordHash The password hash of the user to login.
	 * @returns A TypedResult containing the user data for the new user.
	 */
    public async register(username: string, passwordHash: string): Promise<TypedResult<User>> {
        const mutation = gql`
			mutation RegisterMutation {
				register(username: "${username}", passwordHash: "${passwordHash}") {
					error, id, username, favoriteStopIds, favoriteRouteIds, isAdmin
				}
			}
		`;
        return await this.makeGraphQLRequest<User>(mutation, 'register', true, true);
    }

	/**
	 * Allows the logged in user to change the admin rights of another user.
	 * @param userId The id of the user trying to change the admin rights.
	 * @param targetUsername The username of the target user.
	 * @param adminStatus True to make the target user an admin, otherwise false.
	 * @returns A Result dictating the result of the operation. 
	 */
    public async toggleAdminRights(userId: string, targetUsername: string, adminStatus: boolean): Promise<Result> {
        const mutation = gql`
			mutation AdminStatusMutation {
				toggleAdminRights(grantingId: "${userId}", targetUsername: "${targetUsername}", adminStatus: ${adminStatus}) {
					error
				}
			}
		`;
        return <Result>(await this.makeGraphQLRequest<any>(mutation, 'toggleAdminRights', true, false));
    }

	/**
	 * Sets the ids of the logged in user's favorite bus stops.
	 * @param userId The id of the user.
	 * @param ids The list of ids that represent the user's current set of favorite stops.
	 * @returns A Result dictating the result of the operation.
	 */
    public async editFavoriteStopIDs(userId: string, ids: Array<string>): Promise<Result> {
        const mutation = gql`
			mutation EditStops {
				editFavoriteStopIDs(userId: "${userId}", objectIds: [${ids.length === 0 ? '' : '"' + ids.join('","') + '"'}]) {
					error
				}
			}
		`;
        return <Result>(await this.makeGraphQLRequest<any>(mutation, 'editFavoriteStopIDs', true, false));
    }

	/**
	 * Sets the ids of the logged in user's favorite routes.
	 * @param userId The id of the user.
	 * @param ids The list of ids that represent the current user's current set of favorite routes.
	 * @returns A Result dictaing the result of the operation.
	 */
    public async editFavoriteRouteIDs(userId: string, ids: Array<string>): Promise<Result> {
        const mutation = gql`
			mutation EditRoutes {
				editFavoriteRouteIDs(userId: "${userId}", objectIds: [${ids.length === 0 ? '' : '"' + ids.join('","') + '"'}]) {
					error
				}
			}
		`;
        return <Result>(await this.makeGraphQLRequest<any>(mutation, 'editFavoriteRouteIDs', true, false));
    }

	/**
	 * Allows the logged in user to create a new fake route.
	 * @param userId The id of the logged in user.
	 * @param routeName The name of the new route.
	 * @param routePositions A two dimensional array representing the latitude/longitude pairs of points that make up the route.
	 * @returns A Result dictating the result of the operation.
	 */
    public async addNewRoute(userId: string, routeName: string, routePositions: Array<Array<number>>): Promise<TypedResult<string>> {
        // Encode the list of latitude/longitude objects into a polyline string.
        const encodeResult: string = polyline.encode(routePositions, 5);

        const mutation = gql`
			mutation AddRoute {
				addNewRoute(userId: "${userId}", name: "${routeName}", polyline: "${encodeResult}", stopIDs: []) {
                    error,
                    id
				}
			}
		`;

        const result: TypedResult<any> = await this.makeGraphQLRequest<any>(mutation, 'addNewRoute', true, true);
        if (!result.success)
            return new TypedResult(false, null, result.message);
        return new TypedResult(result.success, <string>result.data['id'], result.message);
    }

	/**
	 * Creates a new fake bus stop.
	 * @param userId The user id of the logged in user.
	 * @param stopName The new name of the stop.
	 * @param latitude The latitude of the bus stop.
	 * @param longitude The longitude of the bus stop.
	 * @returns The result of the operation, with the id of the new stop.
	 */
    public async addNewStop(userId: string, stopName: string, latitude: number, longitude: number): Promise<TypedResult<string>> {
        const mutation = gql`
			mutation AddStop {
				addNewStop(userId: "${userId}", name: "${stopName}", latitude: ${latitude}, longitude: ${longitude}) {
                    error,
                    id
				}
			}
        `;

        const result: TypedResult<any> = await this.makeGraphQLRequest<any>(mutation, 'addNewStop', true, true);
        if (!result.success)
            return new TypedResult(false, null, result.message);
        return new TypedResult(result.success, <string>result.data['id'], result.message);
    }

	/**
	 * Removes a fake route from the database.
	 * @param userId The id of the logged in user.
	 * @param routeId The id of the route to remove.
	 * @returns The result of the operation. 
	 */
    public async removeRoute(userId: string, routeId: string): Promise<Result> {
        const mutation = gql`
			mutation RemoveRoute {
				removeRoute(userId: ${userId}, objectId: "${routeId}") {
					error
				}
			}
		`;
        return <Result>(await this.makeGraphQLRequest<any>(mutation, 'removeRoute', true, false));
    }

	/**
	 * Removes a fake bus stop from the datbase.
	 * @param userId The id of the logged in user.
	 * @param stopId The id of the bus stop to remove.
	 * @returns The result of the operation.
	 */
    public async removeStop(userId: string, stopId: string): Promise<Result> {
        const mutation = gql`
		mutation RemoveStop {
			removeStop(userId: "${userId}", objectId: "${stopId}") {
				error
			}
		}
		`;
        return <Result>(await this.makeGraphQLRequest<any>(mutation, 'removeStop', true, false));
    }

    public async getRoutesNearLocation(location: Coords): Promise<TypedResult<Array<Route>>> {
        const query = gql`
		query {
			getRoutesNearLocation(latitude:${location.lat}, longitude:${location.lng}) {
			  error,
			  routes {
				id,
				name,
				stopIDs,
				polyline
			  }
			}
		  }
		`;
        const result: TypedResult<any> = await this.makeGraphQLRequest<any>(query, 'getRoutesNearLocation', false, true);
        if (!result.success)
            return new TypedResult(false, null, result.message);
        return new TypedResult(result.success, <Array<Route>>result.data['routes'], result.message);
    }

    public async getStopsNearLocation(location: Coords): Promise<TypedResult<Array<Stop>>> {
        const query = gql`
			query GetNearbyStops {
				getStopsNearLocation(latitude: ${location.lat}, longitude: ${location.lng}) {
					error,
					stops {
						id, name, latitude, longitude
					}
				}
			}
		`;
        const result: TypedResult<any> = await this.makeGraphQLRequest<any>(query, 'getStopsNearLocation', false, true);
        if (!result.success)
            return new TypedResult(false, null, result.message);
        return new TypedResult(result.success, <Array<Stop>>result.data['stops'], result.message);
    }

    public async getStops(stopIds: Array<string>): Promise<TypedResult<Array<Stop>>> {
        const query = gql`
			query GetStops {
				getStops(ids: [${stopIds.length === 0 ? '' : '"' + stopIds.join('","') + '"'}]) {
					error, stops {
						id, name, latitude, longitude
					}
				}
			}
		`;
        const result: TypedResult<any> = await this.makeGraphQLRequest<any>(query, 'getStops', false, true);
        if (!result.success)
            return new TypedResult(false, null, result.message);
        return new TypedResult(result.success, <Array<Stop>>result.data['stops'], result.message);
    }

    public async getRoutes(routeIds: Array<string>): Promise<TypedResult<Array<Route>>> {
        const query = gql`
		query GetFakeRoutes {
			getRoutes(ids: [${routeIds.length === 0 ? '' : '"' + routeIds.join('","') + '"'}]) {
			  error, routes {
				id, name, stopIDs, polyline
			  }
			}
		  }
		`;
        const result: TypedResult<any> = await this.makeGraphQLRequest<any>(query, 'getRoutes', false, true);
        if (!result.success)
            return new TypedResult(false, null, result.message);
        return new TypedResult(result.success, <Array<Route>>result.data['routes'], result.message);
    }

    public async getFakeStops(): Promise<TypedResult<Array<Stop>>> {
        const query = gql`
            query GetFakeStops {
                getFakeStops {
                    error, stops {
                        id, name
                    }
                }
            }
        `;
        const result: TypedResult<any> = await this.makeGraphQLRequest<any>(query, 'getFakeStops', false, true);
        if (!result.success)
            return new TypedResult(false, null, result.message);
        return new TypedResult(result.success, <Array<Stop>>result.data['stops'], result.message);
    }

    public async getFakeRoutes(): Promise<TypedResult<Array<Route>>> {
        const query = gql`
            query GetFakeRoutes {
                getFakeRoutes {
                    error, routes {
                        id, name
                    }
                }
            }
        `;
        const result: TypedResult<any> = await this.makeGraphQLRequest<any>(query, 'getFakeRoutes', false, true);
        if (!result.success)
            return new TypedResult(false, null, result.message);
        return new TypedResult(result.success, <Array<Route>>result.data['routes'], result.message);
    }

	/**
	 * A general purpose utility for making requests to the server.
	 * @param interpolatedQuery The GraphQL query with the proper values already interpolated into it.
	 * @param methodName The name of the query or mutation being called in the query.
	 * @param isMutation Whether or not the query is a mutation.
	 * @param hasData Whether or not the query or mutation is expected to return more data than just "error".
	 * @returns A TypedResult that dictates if the operation succeeded, and contains data if the query or mutation returned data.
	 */
    private async makeGraphQLRequest<T>(interpolatedQuery: any, methodName: string, isMutation: boolean, hasData: boolean):
        Promise<TypedResult<T>> {

        try {
            let result: ExecutionResult;
            if (isMutation)
                result = await this.client.mutate({ mutation: interpolatedQuery });
            else
                result = await this.client.query({ query: interpolatedQuery, fetchPolicy: 'network-only' });

            if (result.data[methodName]['error'])
                return new TypedResult(false, null, 'Server failed request: ' + result.data[methodName]['error']);
            else
                return new TypedResult(true, hasData ? Object.assign({}, result.data[methodName]) : null);

        } catch (err) {
            return new TypedResult(false, null, 'Query failed to execute: ' + (<ApolloError>err).message);
        }
    }
}