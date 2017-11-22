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

	polystring: string;
	polyline: any;
}

export interface BusMapProps {
	busses: BusType[];
	stops: StopType[];

	polystring: string;

	zoom: number;
}

export class BusMap extends React.Component<BusMapProps, BusMapState> {
	public constructor(props: BusMapProps) {
		super(props);
		this.state = {
			zoom: props.zoom,
			center: NYC,

			mapLoaded: false,

			busses: props.busses,
			stops: props.stops,

			busMarkers: [new google.maps.Marker()],
			stopMarkers: [new google.maps.Marker()],

			polystring: props.polystring,
			polyline: new google.maps.Polyline()
		};
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

	componentWillReceiveProps(nextProps: BusMapProps) {
		this.updateStops(nextProps.stops);
		this.updateBusses(nextProps.busses);
		this.updatePolyline(nextProps.polystring);
	}

	updateStops(newStops: StopType[]) {
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

		// dispose of old markers
		for (var i = 0; i < oldMarkers.length; i++)
			oldMarkers[i].setMap(null);

		// finalize changes
		this.setState({stops: newStops, center: centroid});
	}

	updateBusses(newBusses: BusType[]) {
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

		// dispose of old markers
		for (let i = 0; i < oldMarkers.length; i++)
			oldMarkers[i].setMap(null);

		// finalize changes
		this.setState({busses: newBusses});
	}

	updatePolyline(newPolystring: string) {
		// ignore if the same
		if (newPolystring == this.state.polyline)
			return;

		let oldPolyline = this.state.polyline;

		var newPolyline = new google.maps.Polyline({
			path: this.convert(newPolystring),
			geodesic: true,
			strokeColor: '#ff0000',
			strokeOpacity: 1.0,
			strokeWeight: 2
		});
		
		if (this.state.map != undefined)
			newPolyline.setMap(this.state.map);
		else
			console.log('this.state.map is undefined?');

		oldPolyline.setMap(null);

		this.setState({polystring: newPolystring, polyline: newPolyline})
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