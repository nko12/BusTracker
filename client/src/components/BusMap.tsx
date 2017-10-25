import * as React from 'react';
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

// TODO: Props interface?
// TODO: remove `any`s

export default class BusMap extends React.Component<any, any> {
	state = {
		pointA: this.props.pointA,
		pointB: this.props.pointB,
		zoom: this.props.zoom,
		center: this.midPoint(this.props.pointA, this.props.pointB),
		map: undefined,
		maps: undefined, // TODO: what's this for?
		mapLoaded: false,
	};

	componentWillReceiveProps(nextProps: any) {
		this.setState({
			zoom: nextProps.zoom,
			pointA: nextProps.pointA,
			pointB: nextProps.pointB,
			center: this.midPoint(nextProps.pointA, nextProps.pointB),
		});
		// marker (Google)
		new google.maps.Marker({
			position: this.state.center,
			map: this.state.map,
		});
		// directions
		var directionsService = new google.maps.DirectionsService;
		var directionsDisplay = new google.maps.DirectionsRenderer({
			suppressMarkers: true,
			map: this.state.map
		});
		directionsService.route({
			origin: nextProps.pointA,
			destination: nextProps.pointB,
			travelMode: google.maps.TravelMode.DRIVING
		}, function(response: any, status: any) {
			if (status === 'OK') {
				directionsDisplay.setDirections(response);
			} else {
				console.log(status);
			}
		});
	}

	midPoint(A: any, B: any) {
		return {
			lat: (A.lat + B.lat) / 2,
			lng: (A.lng + B.lng) / 2,
		}
	}

	render() {
		return (
			<GoogleMap
				zoom={this.state.zoom}
				center={this.state.center}
				yesIWantToUseGoogleMapApiInternals
				onGoogleApiLoaded={({map, maps}) => {
					this.setState({map: map, maps: maps, mapLoaded: true});
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