import * as faker from 'faker';

/**
 * Represents a User of the BusTracker app.
 */
export class User {

    /**
     * Generates a new User object with the properties set to random values.
     * Note that the stop IDs and route IDs are not set.
     */
    static generateRandomUser(): User {

        const user: User = new User();
        user.username = faker.name.firstName() + "." + faker.name.lastName();
        user.firstName = faker.name.firstName();
        user.lastName = faker.name.lastName();
        user.email = faker.internet.email(user.firstName, user.lastName);
        user.passwordHash = faker.random.alphaNumeric(32);
        return user;
    }

    /**
     * The ID of the user.
     */
    public id: string = faker.random.uuid();
    /**
     * The first name of the user.
     */
    public firstName: string = '';
    /**
     * The last name of the user.
     */
    public lastName: string = '';
    /**
     * The username of the user.
     */
    public username: string = '';
    /**
     * The email address of the user.
     */
    public email: string = '';
    /**
     * The password hash of the user's password.
     */
    public passwordHash: string = '';
    /**
     * Whether or not the user has administrative rights.
     */
    public isAdmin: boolean = false;
    /**
     * The list of IDs representing the stops that the user has favorited.
     */
    public favoriteStopIds: Array<number> = [];
    /**
     * The list of IDs representing the routes that the user has favorited.
     */
    public favoriteRouteIds: Array<number> = [];
}