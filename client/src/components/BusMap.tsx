import * as React from 'react';
import * as GoogleMapReact from 'google-map-react';
import GoogleMap from 'google-map-react';
import {BusTrackerEvents, MapDisplayChangeArguments, SelectedObjectType} from '../BusTrackerEvents';
import {getStop, subscribeToStop, subscribeToBus} from '../api/RealTimeApi';

const IMG = 'https://i.imgur.com/7f5HCOn.png';
// const KRH = 'https://i.imgur.com/SUxfnuv.png';

const ORIGIN = {lat: 0.0, lng: 0.0};
const NYC = {lat: 40.7588528, lng: -73.9852625};

const INTERVAL = 1000;

export interface BusType {
	location: GoogleMapReact.Coords;
	ID: string;
}

export interface StopType {
	location: GoogleMapReact.Coords;
	ID: string;
}

export interface BusMapState {
	zoom: number;
	center: GoogleMapReact.Coords;

	map?: google.maps.Map;
	maps?: GoogleMapReact.Maps;

	mapLoaded: boolean;

	busses: BusType[];
	stops: StopType[];

	busMarkers: google.maps.Marker[];
	stopMarkers: google.maps.Marker[];

	polyString: string;
	polyLine: google.maps.Polyline | null;
}

export interface BusMapProps {
	zoom: number;
}

export class BusMap extends React.Component<BusMapProps, BusMapState> {
	public constructor(props: BusMapProps) {
		super(props);
		this.state = {
			zoom: props.zoom,
			center: NYC,

			mapLoaded: false,

			busses: new Array<BusType>(),
			stops: new Array<StopType>(),

			busMarkers: null,
			stopMarkers: null,

			polyString: '',
			polyLine: null
		};

		BusTrackerEvents.map.mapDisplayChangeRequested.add(this.displayChangeRequested);
	}

	convert(encoded: string) {
		let len = encoded.length, index = 0, array = [], lat = 0, lng = 0;

		while (index < len) {
			let b, shift = 0, result = 0;
			
			do {
				b = encoded.charCodeAt(index++) - 63;
				result |= (b & 0x1f) << shift;
				shift += 5;
			} while (b >= 0x20);

			lat += ((result & 1) ? ~(result >> 1) : (result >> 1));
			shift = result = 0;

			do {
				b = encoded.charCodeAt(index++) - 63;
				result |= (b & 0x1f) << shift;
				shift += 5;
			} while (b >= 0x20);

			lng += ((result & 1) ? ~(result >> 1) : (result >> 1));

			array.push({lat: lat * 1e-5, lng: lng * 1e-5});
		}

		return array;
	}

	componentDidMount(): void {
		this.setState({
			busMarkers: [] as google.maps.Marker[],
			stopMarkers: [] as google.maps.Marker[],
			polyLine: null
		});

		
	}

	displayChangeRequested = (args: MapDisplayChangeArguments) => {
		switch (args.type) {
			case SelectedObjectType.Bus: // BUS
				subscribeToBus({interval: INTERVAL, busID: args.ID.split('_')[1]}, (err: any, busLoc: GoogleMapReact.Coords) => {
					this.updateBusses([{location: busLoc, ID: args.ID}]);
				});
				break;
			case SelectedObjectType.Stop: // STOP
				// just do it if a location was given
				if (args.location)
					this.updateStops([{location: args.location, ID: args.ID}]);
				else // otherwise we need to find it
					getStop(args.ID.split('_')[1], (err: any, stopLoc: GoogleMapReact.Coords) => {
						this.updateStops([{location: stopLoc, ID: args.ID}]);
					});

				subscribeToStop({interval: INTERVAL, stopID: args.ID}, (err: any, busObjs: BusType[]) => {
					let busses: BusType[] = [];
					for (let i = 0; i < busObjs.length; i++)
						busses.push({location: busObjs[i].location, ID: busObjs[i].ID.split('_')[1]});

					this.updateBusses(busses);
				});
				break;
			case SelectedObjectType.Route: // ROUTE
				if (args.polyString)
					this.updatePolyline(args.polyString);
				else
					console.log('error: args.polyString is ' + JSON.stringify(args.polyString) + ' in displayChangeRequested()');
				break;
			case SelectedObjectType.None:
				break;
			default:
				break;
		}
	}

	updateBusses = (newBusses: BusType[]) => {
		// ignore busses at the origin
		if (newBusses.length > 0 && JSON.stringify(newBusses[0].location) == JSON.stringify(ORIGIN))
			return;

		// the markers we're working with
		let oldMarkers = this.state.busMarkers;
		let newMarkers = [] as google.maps.Marker[];

		// loop through new stops to make their markers
		for (let i = 0; i < newBusses.length; i++)
			newMarkers.push(new google.maps.Marker({
				position: newBusses[i].location,
				map: this.state.map,
				icon: IMG
			}));

		// finalize changes
		this.setState({busses: newBusses, busMarkers: newMarkers});

		// dispose of old markers
		for (let i = 0; i < oldMarkers.length; i++)
			oldMarkers[i].setMap(null);
	}

	updateStops = (newStops: StopType[]) => {
		// ignore stops at the origin
		if (newStops.length == 0 || newStops.length > 0 && JSON.stringify(newStops[0].location) == JSON.stringify(ORIGIN))
			return;

		// the markers we're working with
		let oldMarkers = this.state.stopMarkers;
		let newMarkers = [];
		// variables for centroid calculation
		let centroid = {lat: 0.0, lng: 0.0};
		let total = newStops.length;

		// loop through new stops
		for (let i = 0; i < newStops.length; i++) {
			// create the new markers
			newMarkers.push(new google.maps.Marker({
				position: newStops[i].location,
				map: this.state.map
			}));

			// part of centroid calculation
			centroid.lat += newStops[i].location.lat;
			centroid.lng += newStops[i].location.lng;
		}
		// finish centroid calculation
		centroid.lat /= total;
		centroid.lng /= total;

		// finalize changes
		this.setState({stops: newStops, stopMarkers: newMarkers, center: centroid});

		// dispose of old markers
		for (var i = 0; i < oldMarkers.length; i++)
			oldMarkers[i].setMap(null);
	}

	updatePolyline(newPolyString: string) {
		// ignore if the same
		if (newPolyString == this.state.polyString)
			return;

		let oldPolyLine = this.state.polyLine;

		var newPolyLine = new google.maps.Polyline({
			path: this.convert(newPolyString),
			geodesic: true,
			strokeColor: '#00D4ff',
			strokeOpacity: 1.0,
			strokeWeight: 2
		});
		
		if (this.state.map != undefined)
			newPolyLine.setMap(this.state.map);
		else
			console.log('this.state.map is undefined?');

		if (oldPolyLine)
			oldPolyLine.setMap(null);

		this.setState({polyString: newPolyString, polyLine: newPolyLine});
	}

	midPoint(a: GoogleMapReact.Coords, b: GoogleMapReact.Coords) {
		return {
			lat: (a.lat + b.lat) / 2,
			lng: (a.lng + b.lng) / 2
		};
	}

	render() {
		return (
			<GoogleMap
				zoom={this.state.zoom}
				center={this.state.center}
				yesIWantToUseGoogleMapApiInternals={true}
				onGoogleApiLoaded={({map, maps}) => {
					this.setState({map: map, maps: maps, mapLoaded: true});
				}}
			/>
		);
	}
}