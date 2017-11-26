/**
 * Represents a User of the BusTracker app.
 */
export class User {

    /**
     * The ID of the user.
     */
    public id: string = '';
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
    public favoriteStopIds: string[] = [];
    /**
     * The list of IDs representing the routes that the user has favorited.
     */
    public favoriteRouteIds: string[] = [];
}