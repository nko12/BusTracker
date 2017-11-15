import * as React from 'react';
import * as GMapReact from 'google-map-react';
import GoogleMap from 'google-map-react';

const IMG = 'https://i.imgur.com/7f5HCOn.png';
// const KRH = 'https://i.imgur.com/SUxfnuv.png';

const ORIGIN = {lat: 0, lng: 0};

export interface BusType {
	location: GMapReact.Coords;
	ID: string;
}

export interface StopType {
	location: GMapReact.Coords;
	ID: string;
}

export interface BusMapState {
	zoom: number;
	center: GMapReact.Coords;

	map?: google.maps.Map;
	maps?: GMapReact.Maps;

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
			center: {lat: 40.7588528, lng: -73.9852625},

			mapLoaded: false,

			busses: this.props.busses,
			stops: this.props.stops,

			busMarkers: [new google.maps.Marker()],
			stopMarkers: [new google.maps.Marker()]
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

		// stops
		var oldStopMarkers = this.state.stopMarkers;
		var stopMarkers = [];

		for (var i = 0; i < nextProps.stops.length; i++)
			stopMarkers.push(new google.maps.Marker({
				position: nextProps.stops[i].location,
				map: this.state.map
			}));

		this.setState({stops: nextProps.stops, stopMarkers: stopMarkers});

		for (var i = 0; i < oldStopMarkers.length; i++)
			oldStopMarkers[i].setMap(null);

		// change center to match first stop
		// TODO: what happens when more than one stop?
		if (this.state.stops.length > 0 && JSON.stringify(this.state.stops[0].location) != JSON.stringify(ORIGIN)) {
			var center = this.state.stops[0].location;
			this.setState({center: center});
		}

		// busses
		var oldBusMarkers = this.state.busMarkers;
		var newBusMarkers = []

		for (var i = 0; i < nextProps.busses.length; i++)
			newBusMarkers.push(new google.maps.Marker({
				position: nextProps.busses[i].location,
				map: this.state.map,
				icon: IMG
			}));

		this.setState({busses: nextProps.busses, busMarkers: newBusMarkers});

		for (var i = 0; i < oldBusMarkers.length; i++)
			oldBusMarkers[i].setMap(null);

		// directions
		// var directionsService = new google.maps.DirectionsService;
		// var directionsDisplay = new google.maps.DirectionsRenderer({
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

	midPoint(A: GMapReact.Coords, B: GMapReact.Coords) {
		return {
			lat: (A.lat + B.lat) / 2,
			lng: (A.lng + B.lng) / 2,
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
			>
			</GoogleMap>
		);
	}
}