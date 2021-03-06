import * as React from 'react';
import * as GoogleMapReact from 'google-map-react';
import GoogleMap from 'google-map-react';
import {BusTrackerEvents, MapDisplayChangeArguments, SelectedObjectType} from '../BusTrackerEvents';
import {getStop, subscribeToStop, subscribeToBus, cancelSubscriptions} from '../api/RealTimeApi';

const IMG = 'https://i.imgur.com/7f5HCOn.png';
// const KRH = 'https://i.imgur.com/SUxfnuv.png';

const ORIGIN = {lat: 0.0, lng: 0.0};
const NYC = {lat: 40.7588528, lng: -73.9852625};
const INTERVAL = 10000;

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

	busMarkers: google.maps.Marker[] | null;
	stopMarkers: google.maps.Marker[] | null;

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

	// upon mounting, google is no longer undefined, so create the necessary empty arrays
	componentDidMount(): void {
		this.setState({
			busMarkers: [] as google.maps.Marker[],
			stopMarkers: [] as google.maps.Marker[],
			polyLine: null
		});
	}

	// converts an encoded polyString into an array of lat/lng's, which Google Maps can understand
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

	// called when calling `BusTrackerEvents.map.mapDisplayChangeRequested.dispatch()`
	// this is how the SideBar sends data to the BusMap for displaying
	displayChangeRequested = (args: MapDisplayChangeArguments) => {
		switch (args.type) {
			// TODO: currently, the app doesn't have support for tracking individual busses.
			// The BusMap component can handle it though.
			// The main issue was time constraints, so storing individual bus data such as
			// user favorites was never implemented on the DataBase or SideBar side.
			case SelectedObjectType.Bus: // BUS
				// cancel realTime subscription if fake
				if (args.ID.split('_')[0] == 'FAKE')
					cancelSubscriptions();

				// get realtime bus data from socket
				subscribeToBus({interval: INTERVAL, busID: args.ID.split('_')[1]}, (err: any, busLoc: GoogleMapReact.Coords) => {
					this.updateBusses([{location: busLoc, ID: args.ID}]);
				});
				break;

			case SelectedObjectType.Stop: // STOP
				// just do it if a location was given
				if (args.location)
					this.updateStops([{location: args.location, ID: args.ID}]);
				else // otherwise we need to find it
					getStop(args.ID.split('_').pop(), (err: any, stopLoc: GoogleMapReact.Coords) => {
						this.updateStops([{location: stopLoc, ID: args.ID}]);
					});

				// don't get busses for fake stops
				if (args.ID.split('_')[0] != 'FAKE')
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

			case SelectedObjectType.None: // NONE
				// stop getting updates
				cancelSubscriptions();

				// dispose of old busses
				let markers = this.state.busMarkers;
				for (let i = 0; i < markers.length; i++)
					markers[i].setMap(null);

				// dispose of old markers
				markers = this.state.stopMarkers;
				for (let i = 0; i < markers.length; i++)
					markers[i].setMap(null);

				// dispose of old polyLine
				let polyLine = this.state.polyLine;
				if (polyLine)
					polyLine.setMap(null);

				this.setState({busses: [], stops: [], busMarkers: [], stopMarkers: [], polyString: '', polyLine: null});
				break;

			default:
				break;
		}
	}

	// Update the busses displayed on the map.
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

	// Update the stops displayed on the map.
	// TODO: currently the BusMap component can handle displaying more than one Stop. In order to get this functionality
	// in the full app though, more implementation is required on the DataBase and SideBar side.
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

	// Update the polyline displayed on the map.
	// TODO: the BusMap does not yet have functionality for more than one PolyLine on the map at a time.
	// That should be easy to implement, but more functionality is required on the DataBase and SideBar side first.
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
			strokeWeight: 4
		});
		
		if (this.state.map != undefined)
			newPolyLine.setMap(this.state.map);
		else
			console.log('this.state.map is undefined?');

		if (oldPolyLine)
			oldPolyLine.setMap(null);

		this.setState({polyString: newPolyString, polyLine: newPolyLine});
	}

	// Utility function for getting the midpoint of two lat/lng's.
	midPoint(a: GoogleMapReact.Coords, b: GoogleMapReact.Coords) {
		return {
			lat: (a.lat + b.lat) / 2,
			lng: (a.lng + b.lng) / 2
		};
	}

	// Render the GoogleMapReact.GoogleMap
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