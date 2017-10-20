import * as mongoose from 'mongoose';

// A class that contains the various database schemas.
export class Schemas {

    // The User schema.
    public static userSchema: mongoose.Schema = new mongoose.Schema({
        id: Number,
        firstName: String,
        lastName: String,
        email: String,
        passwordHash: String,
        favoriteStopIds: [],
        favoriteRouteIds: []
    });
}