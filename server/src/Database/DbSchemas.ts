import * as mongoose from 'mongoose';

/**
 * Contains the various database schemas used by the BusTrackerDb.
 */
export class Schemas {

    // The User schema.
    public static userSchema: mongoose.Schema = new mongoose.Schema({
        id: { type: String, index: true },
        firstName: String,
        lastName: String,
        email: String,
        passwordHash: String,
        favoriteStopIds: [],
        favoriteRouteIds: []
    }, {
            // Make sure the name of the collection is "User" and not "users".
            collection: 'User'
        });

    public static schemaNames: string[] = [
        'User'
    ];
}

/**
 * Represents a 'User' Mongoose Model.
 */
export const UserType = mongoose.model('User', Schemas.userSchema);