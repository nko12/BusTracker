import * as React from 'react';
import * as GMapReact from 'google-map-react';
import GoogleMap from 'google-map-react';
import BusMarker from './BusMarker';

// google-map-react API:
// 		https://github.com/istarkov/google-map-react/blob/master/API.md
// There are a few other GoogleMaps packages for React that I know about:
// google-maps-react
// react-google-maps
// react-gmaps
// None of which have TypeScript definitions, which is why we're using google-map-react.
// however, the documentation for google-map-react is sparse and it doesn't seem to do as much as the others

// TODO: ability to remove markers and routes

interface BusType {
	location: GMapReact.Coords;
	ID: String;
}

export interface BusMapState {
	pointA: GMapReact.Coords;
	pointB: GMapReact.Coords;
	zoom: number;
	center: GMapReact.Coords;
	map?: google.maps.Map;
	maps?: GMapReact.Maps;
	mapLoaded: boolean;
	busses: [BusType];

	markers: google.maps.Marker[];
}

export interface BusMapProps {
	pointA: GMapReact.Coords;
	pointB: GMapReact.Coords;
	busses: [BusType];
	zoom: number;
}

export default class BusMap extends React.Component<BusMapProps, BusMapState> {
	public constructor(props: BusMapProps) {
		super(props);
		this.state = {
			pointA: this.props.pointA,
			pointB: this.props.pointB,
			zoom: this.props.zoom,
			center: this.midPoint(this.props.pointA, this.props.pointB),
			mapLoaded: false,
			busses: this.props.busses,
			markers: [new google.maps.Marker()]
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

		console.log(JSON.stringify(nextProps.busses));

		var oldMarkers = this.state.markers;

		var markers = []
		for (var i = 0; i < nextProps.busses.length; i++)
			markers.push(new google.maps.Marker({
				position: nextProps.busses[i].location,
				map: this.state.map,
				icon: 'https://i.imgur.com/7f5HCOn.png'
			}));

		this.setState({markers: markers});

		for (var i = 0; i < oldMarkers.length; i++)
			oldMarkers[i].setMap(null);

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
		// 		// TODO: Lint reports calls to 'console.log' is not allowed. After looking it up, 
		// 		// it's trying to help us prevent lines  like this from existing in production code. 
		// 		// This kind of thing should only be seen in tests (according to TSLint).
		// 		// We can figure out how to deal with this later.
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
				onGoogleApiLoaded={({ map, maps }) => {
					this.setState({ map: map, maps: maps, mapLoaded: true });
					// init marker at midpoint
					new google.maps.Marker({
						position: this.state.center,
						map: map,
					});
				}}
			>
				<BusMarker
					lat={this.state.pointA.lat}
					lng={this.state.pointA.lng}
					text={'A'}
				/>
				<BusMarker
					lat={this.state.pointB.lat}
					lng={this.state.pointB.lng}
					text={'B'}
				/>
			</GoogleMap>
		);
	}
}