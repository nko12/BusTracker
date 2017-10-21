import * as mongoose from 'mongoose';

// A class that contains the various database schemas.
export class Schemas {

    // The User schema.
    public static userSchema: mongoose.Schema = new mongoose.Schema({
        id: {type: Number, index: true},
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