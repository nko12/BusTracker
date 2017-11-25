import * as request from 'request-promise-native';
import { Route, BusStop } from './Models';
import { Result, TypedResult } from './Result';

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
    list: [BusTimeRouteObject]
}

interface BusTimeStopObject {
    id: string,
    lat: number,
    lon: number,
    direction: string,
    name: string,
}

interface BusTimeShapeObject {
    points: string,
    length: number
}

interface RoutesForLocationResult extends BusTimeResponse {
    data: {
        routes: [BusTimeRouteObject];
    }
}

interface BusStopsForLocationResult extends BusTimeResponse {
    data: {
        stops: [BusTimeStopObject];
    }
}

interface ShapeResult extends BusTimeResponse {

}

/**
 * Contains methods for communicating with BusTime.
 */
export class BusTimeApi {

    /**
     * Represents the bus time API key.
     */
    private KEY = '8e4264f7-a1c1-49f3-930a-f2f1430f5e90';

    /**
     * Represents the base url for all static api calls.
     */
    private URL_BASE = 'http://bustime.mta.info/api/where/';

    public async GetRoutesNearPosition(latitude: number, longitude: number): Promise<TypedResult<Array<Route> | null>> {
        const url: string = `${this.URL_BASE}routes-for-location.json?key=${this.KEY}&lat=${latitude}&lon=${longitude}`;
        try {
            const resultData: RoutesForLocationResult = <RoutesForLocationResult> JSON.parse(await request(url));
            if (resultData.code != 200) {
                return new TypedResult(false, null, 'Failed to get data from BusTime: ' + resultData.text);
            }

            const routes: Array<Route> = new Array<Route>();
            resultData.data.routes.forEach(element => {
                const busTimeRoute: BusTimeRouteObject = element;
                routes.push({id: busTimeRoute.id, name: busTimeRoute.longName, polyline: '', busStopIDs: []});
            });

            return new TypedResult(true, routes);
        } catch (err) {
            return new TypedResult(false, null);
        }
    }

    public async GetBusStopsNearPosition(latitude: number, longitude: number): Promise<TypedResult<Array<BusStop> | null>> {
        const url: string = `${this.URL_BASE}stops-for-location.json?key=${this.KEY}&lat=${latitude}&lon=${longitude}`;
        try {
            const resultData: BusStopsForLocationResult = <BusStopsForLocationResult> JSON.parse(await request(url));
            if (resultData.code != 200) {
                return new TypedResult(false, null, 'Failed to get data from BusTime: ' + resultData.text);
            }

            const stops: Array<BusStop> = new Array<BusStop>();
            resultData.data.stops.forEach(element => {
                const busTimeStop: BusTimeStopObject = element;
                stops.push({id: busTimeStop.id, name: busTimeStop.name, latitude: busTimeStop.lat, longitude: busTimeStop.lon});
            });

            return new TypedResult(true, stops);
        } catch (err) {
            return new TypedResult(false, null);
        }
    }

/*     public async GetPolylineForRoute(routeId: number): Promise<TypedResult<string>> {
        const url: string = `${this.URL_BASE}shape/${routeId}.json?key=${this.KEY}`;
        try {
            const resultData: BusStopsForLocationResult = <BusStopsForLocationResult> JSON.parse(await request(url));
        } catch (err) {
            return new TypedResult(false, null, JSON.stringify(err));
        }
    } */
}