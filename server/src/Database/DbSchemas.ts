// Use 'require' here as TypeScript will not compile when trying to set the Promise type of mongoose.
import mongoose = require('mongoose');

// Make mongoose use the native Promise type.
mongoose.Promise = global.Promise;

/**
 * Contains the various database schemas used by the BusTrackerDb.
 */
export class Schemas {

    // The User schema.
    public static userSchema: mongoose.Schema = new mongoose.Schema({
        id: { type: String, index: true },
        isAdmin: Boolean,
        firstName: String,
        lastName: String,
        username: String,
        email: String,
        passwordHash: String,
        favoriteStopIds: [],
        favoriteRouteIds: []
    }, {
            // Make sure the name of the collection is "User" and not "users".
            collection: 'User'
    });

    // The Route schema.
    public static routeSchema: mongoose.Schema = new mongoose.Schema({
        id: { type: String, index: true },
        name: String,
        polyline: String,
        stopIDs: []
    }, {
            // Make sure the name of the collection is "Route" and not "routes".
            collection: 'Route'
    });

    // The Stop schema.
    public static stopSchema: mongoose.Schema = new mongoose.Schema({
        id: {type: String, index: true},
        name: String,
        latitude: Number,
        longitude: Number
    }, {
        collection: 'Stop'
    });

    public static schemaNames: string[] = [
        'User',
        'Route',
        'Stop'
    ];
}

/**
 * Represents a 'User' Mongoose Model.
 */
export const UserType = mongoose.model('User', Schemas.userSchema);
/**
 * Represents a 'Route' Mongoose Model.
 */
export const RouteType = mongoose.model('Route', Schemas.routeSchema);
/**
 * Represents a 'Stop' Mongoose Model.
 */
export const StopType = mongoose.model('Stop', Schemas.stopSchema);