import * as React from 'react';
import * as GoogleMapReact from 'google-map-react';
import GoogleMap from 'google-map-react';

const IMG = 'https://i.imgur.com/7f5HCOn.png';
// const KRH = 'https://i.imgur.com/SUxfnuv.png';

const ORIGIN = {lat: 0.0, lng: 0.0};
const NYC = {lat: 40.7588528, lng: -73.9852625};

export interface BusType {
	location: GoogleMapReact.Coords;
	ID: string;
}

export interface StopType {
	location: GoogleMapReact.Coords;
	ID: string;
	// name: string;
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
}

export interface BusMapProps {
	busses: BusType[];
	stops: StopType[];

	zoom: number;
}

export class BusMap extends React.Component<BusMapProps, BusMapState> {
	public constructor(props: BusMapProps) {
		super(props);
		this.state = {
			zoom: this.props.zoom,
			center: NYC,

			mapLoaded: false,

			busses: this.props.busses,
			stops: this.props.stops,

			busMarkers: [] as google.maps.Marker[],
			stopMarkers: [] as google.maps.Marker[]
		};
	}

	componentWillReceiveProps(nextProps: BusMapProps) {
		// this.setState({
		// 	zoom: nextProps.zoom,
		// 	pointA: nextProps.pointA,
		// 	pointB: nextProps.pointB,
		// 	center: this.midPoint(nextProps.pointA, nextProps.pointB),
		// });
		// // marker (Google)
		// new google.maps.Marker({
		// 	position: this.state.center,
		// 	map: this.state.map,
		// });

		this.updateStops(nextProps.stops);
		this.updateBusses(nextProps.busses);

		// directions
		// let directionsService = new google.maps.DirectionsService;
		// let directionsDisplay = new google.maps.DirectionsRenderer({
		// 	suppressMarkers: true,
		// 	map: this.state.map
		// });
		// directionsService.route({
		// 	origin: nextProps.pointA,
		// 	destination: nextProps.pointB,
		// 	travelMode: google.maps.TravelMode.DRIVING
		// }, (response: google.maps.DirectionsResult, status: google.maps.DirectionsStatus) => {
		// 	if (status === google.maps.DirectionsStatus.OK) {
		// 		directionsDisplay.setDirections(response);
		// 	} else {
		// 		console.log(status);
		// 	}
		// });
	}

	updateStops (newStops: StopType[]) {
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

		console.log('setting center to ' + JSON.stringify(centroid));

		// finalize changes
		this.setState({stops: newStops, stopMarkers: newMarkers, center: centroid});

		// dispose of old markers
		for (var i = 0; i < oldMarkers.length; i++)
			oldMarkers[i].setMap(null);
	}

	updateBusses (newBusses: BusType[]) {
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