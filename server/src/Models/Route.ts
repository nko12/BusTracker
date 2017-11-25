import * as faker from 'faker';

/**
 * Represents a bus route.
 */
export class Route {

    /**
     * Represents the unique ID for the route.
     */
    public id: string = faker.random.uuid();

    /**
     * The name of the route.
     */
    public name: string = '';

    /**
     * An encoded string representing a series of GPS coordinates. This can be directly used by
     * Google Maps to actually draw a representation of the route on the map.
     */
    public polyline: string = '';

    /**
     * A list of the bus stop IDs that make up this route.
     */
    public stopIDs: Array<string> = [];
}