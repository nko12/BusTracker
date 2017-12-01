import * as request from 'request-promise-native';
import { Route, Stop } from './Models';
import { Result, TypedResult } from './Result';
import { BusTrackerDB } from './Database'

interface BusTimeResponse {
    code: number,
    text: string,
    version: string
}

interface BusTimeRouteObject {
    id: string,
    shortName: string,
    longName: string,
    description: string,
    agencyId: string,
}

interface BusTimeStopObject {
    id: string,
    lat: number,
    lon: number,
    direction: string,
    name: string,
}

interface BusTimePolylineObject {
    points: string,
    length: number,
    levels: number
}

interface RoutesForLocationResult extends BusTimeResponse {
    data: {
        routes: Array<BusTimeRouteObject>;
    }
}

interface StopsForLocationResult extends BusTimeResponse {
    data: {
        stops: Array<BusTimeStopObject>;
    }
}

interface StopsForRouteResult extends BusTimeResponse {
    data: {
        polylines: [BusTimePolylineObject];
        route: BusTimeRouteObject;
        stops: Array<BusTimeStopObject>
    }
}

interface ExtraRouteData {
    polyline: BusTimePolylineObject,
    stops: Array<string>
}

/**
 * Contains methods for communicating with BusTime.
 */
export class BusTimeApi {

    private readonly storage: BusTrackerDB;

    public constructor(db: BusTrackerDB) {
        this.storage = db;
    }

    /**
     * Represents the bus time API key.
     */
    private KEY = '8e4264f7-a1c1-49f3-930a-f2f1430f5e90';

    /**
     * Represents the base url for all static api calls.
     */
    private URL_BASE = 'http://bustime.mta.info/api/where/';

    /**
     * Gets the route objects that are near a specific position. This will also include fake routes admin have created.
     * @param latitude The latitude to use.
     * @param longitude The longitude to use.
     * @returns The result of the operation which contains an array of route objects that are near the specified latitude/longitude.
     */
    public async GetRoutesNearPosition(latitude: number, longitude: number): Promise<TypedResult<Array<Route>> | TypedResult<null>> {
        const url: string = `${this.URL_BASE}routes-for-location.json?key=${this.KEY}&lat=${latitude}&lon=${longitude}`;
        try {
            const resultData: RoutesForLocationResult = <RoutesForLocationResult> JSON.parse(await request(url));
            if (resultData.code != 200) {
                return new TypedResult(false, null, 'Failed to get data from BusTime: ' + resultData.text);
            }

            let routes: Array<Route> = new Array<Route>();
            for (let i = 0; i < resultData.data.routes.length; i++) {
                const busTimeRoute: BusTimeRouteObject = resultData.data.routes[i];
                
                // Check if the database already has a record of this route. Use it (which should include the polyline)
                // if it is found.
                const dbRouteResult = await this.storage.getRoute(busTimeRoute.id);
                if (dbRouteResult.success) {
                    routes.push(<Route> dbRouteResult.data);
                    continue;
                }
                
                // Create the route object.
                const route: Route = {id: busTimeRoute.id, name: busTimeRoute.longName, polyline: '', stopIDs: []};
                
                // The route was not found in the database. First, attempt to get the extra data for it. Even if this fails, we need to
                // store the route anyway. Failing to find the polyline and stop ids will result in it just not showing up on the map when selected.
                let extraDataResult = await this.GetExtraRouteData(busTimeRoute.id);
                if (!extraDataResult.success) {
                    console.log(`Failed to get the extra data for route with id '${busTimeRoute.id}' 
                    and name '${busTimeRoute.longName}'. ${extraDataResult.message}. Polyline and stop data for the route will be ignored.`)
                }
                
                if (extraDataResult.data != null) {
                    route.polyline = extraDataResult.data.polyline.points;
                    route.stopIDs = extraDataResult.data.stops;
                }
                
                routes.push(route);
                await this.storage.addNewRealRoute(route);
            }

            // Throw in the fake routes into the mix as well so users can always see them.
            const fakeRouteResults = await this.storage.getAllFakeRoutes();
            if (fakeRouteResults.success) {
                routes = routes.concat(<Array<Route>> fakeRouteResults.data);
            }        

            return new TypedResult(true, routes);
        } catch (err) {
            return new TypedResult(false, null);
        }
    }

    /**
     * Gets the stop objects that are near a specific position. This will also include fake stops admin have created.
     * @param latitude The latitude to use.
     * @param longitude The longitude to use.
     * @returns The result of the operation which contains an array of stop objects that are near the specified latitude/longitude.
     */
    public async GetStopsNearPosition(latitude: number, longitude: number): Promise<TypedResult<Array<Stop> | null>> {
        const url: string = `${this.URL_BASE}stops-for-location.json?key=${this.KEY}&lat=${latitude}&lon=${longitude}`;
        try {
            const resultData: StopsForLocationResult = <StopsForLocationResult> JSON.parse(await request(url));
            if (resultData.code != 200) {
                return new TypedResult(false, null, 'Failed to get data from BusTime: ' + resultData.text);
            }

            let stops: Array<Stop> = new Array<Stop>();
            for (let i = 0; i < resultData.data.stops.length; i++) {
                const busTimeStop: BusTimeStopObject = resultData.data.stops[i];
                const stop: Stop = {id: busTimeStop.id, name: busTimeStop.name, latitude: busTimeStop.lat, longitude: busTimeStop.lon};
                stops.push(stop);
                await this.storage.addNewRealStop(stop);
            }

            // Throw in the fake stops into the mix as well so users can always see them.
            const fakeStopResults = await this.storage.getAllFakeStops();
            if (fakeStopResults.success) {
                stops = stops.concat(<Array<Stop>> fakeStopResults.data);
            }    

            return new TypedResult(true, stops);
        } catch (err) {
            return new TypedResult(false, null);
        }
    }

    /**
     * Gets the extra data (polyline and bus stops) associated with a specific route.
     * @param routeId The id of the route to get extra data for.
     * @returns The result of the operation which contains the extra route data for the specified route.
     */
    private async GetExtraRouteData(routeId: string): Promise<TypedResult<ExtraRouteData> | TypedResult<null>> {
        const url: string = `${this.URL_BASE}stops-for-route/${encodeURIComponent(routeId)}.json?key=${this.KEY}&includePolylines=true`;
        try {
            const resultData: StopsForRouteResult = <StopsForRouteResult> JSON.parse(await request(url));
            if (resultData.code != 200) {
                return new TypedResult(false, null, 'Failed to get data from BusTime: ' + resultData.text);
            }

            // A whole bunch of polylines are returned. Use whichever one is the longest.
            let longestPolylineIndex: number = -1;
            let longestPolylineLength = Number.MIN_SAFE_INTEGER;
            for(let i = 0; i < resultData.data.polylines.length; i++) {
                const polylineInfo = resultData.data.polylines[i];
                if (polylineInfo.length > longestPolylineLength) {
                    longestPolylineLength = polylineInfo.length;
                    longestPolylineIndex = i;
                }
            }

            if (longestPolylineIndex != -1) {
                // Create an array of strings to represent the bus stop ids.
                const stopIds: Array<string> = new Array<string>();
                for (let stop of resultData.data.stops) {
                    
                    // Add this stop data to the database. If it already exists, the add is ignored.
                    await this.storage.addNewRealStop({id: stop.id, name: stop.name, latitude: stop.lat, longitude: stop.lon});
                    stopIds.push(stop.id);
                }

                return new TypedResult(true, { polyline: resultData.data.polylines[longestPolylineIndex], stops: stopIds });
            } else {
                return new TypedResult(false, null, 'Unable to find the longest polyline for the route.');
            }       

        } catch (err) {
            return new TypedResult(false, null, JSON.stringify(err));
        }
    }
}