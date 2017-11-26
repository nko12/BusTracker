import * as faker from 'faker';

/**
 * Represents a Bus Stop.
 */
export class Stop {

    /**
     * Represents the unique ID of the bus stop.
     */
    public id: string = faker.random.uuid();

    /**
     * The name of the bus stop.
     */
    public name: string = '';

    /**
     * The global latitude of the bus stop.
     */
    public latitude: number = 0;

    /**
     * The global longitude of the bus stop.
     */
    public longitude: number = 0;
}