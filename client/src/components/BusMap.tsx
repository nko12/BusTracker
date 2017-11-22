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

			busMarkers: [new google.maps.Marker()],
			stopMarkers: [new google.maps.Marker()]
		};
	}

	convert(encoded: string) {
		var len = encoded.length,
				index = 0,
				array = [],
				lat = 0,
				lng = 0;

		while (index < len) {
			var b,
					shift = 0,
					result = 0;
			
			do {
				b = encoded.charCodeAt(index++) - 63;
				result |= (b & 0x1f) << shift;
				shift += 5;
			} while (b >= 0x20);

			var dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
			lat += dlat;

			shift = 0;
			result = 0;

			do {
				b = encoded.charCodeAt(index++) - 63;
				result |= (b & 0x1f) << shift;
				shift += 5;
			} while (b >= 0x20);

			var dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
			lng += dlng;

			array.push({lat: lat * 1e-5, lng: lng * 1e-5});
		}

		console.log(JSON.stringify(array));

		return array;
	}

	componentWillReceiveProps(nextProps: BusMapProps) {
		this.updateStops(nextProps.stops);
		this.updateBusses(nextProps.busses);

		var polyline = new google.maps.Polyline({
			path: this.convert('ybpwFvxsbMuC_CUKWMaBe@gCo@A?_@Eg@O}DkAo@e@oCuB{BeBYSSOgCmBaAo@iAw@QKoBuAsBaBq@g@oI}GKIc@oAuBsAe@]}ASmCc@}B_@YEyC_@qACC?eADa@JgBRm@CWSs@e@AA{@g@MKm@c@aAm@KMq@e@y@i@uBqAsBwAuBsAYSaBgAcC_BgAs@}@m@yByAITsBrGIZ}B{AyByA{ByAm@a@mAw@{ByA{@k@}@m@{ByA{ByAeCaBwBwAMGyByA{ByAeBiASO}ByA{ByAmBqAMIcC_BqBuASM{ByA}B{AmBoAOK{ByAqBsAKG}B{AoBqAKG}B{A}B{AoBoAMI{B{A{B{AoBoAMIeCcByBwAMI{ByA}B{AeBiAUQ}ByA}B{Ak@_@oAy@}B{AiBmAQM}B{As@c@gAu@}B{Au@e@gAu@{ByAiCcBoA{@w@g@}B{A_C{A[UaBgA_C{AeAs@w@g@gCcBsA{@u@g@}B{A_C{AmBqAOK}B{A_C}AgCaBcAq@cAq@{ByAoBoAMK}B{A}B{AeAs@u@e@}B}AkAu@q@c@}B{AuA}@o@c@gCaBkBqAQK}B{AkFiDMK}B{AgAu@u@e@gBkAUM}B}AkBmAYSgCaB{@m@_Am@}B{A}@m@_Am@}B{Au@e@kAw@yE}CuCoB{@i@oA{@gCaB}B{Aq@e@iAu@gAs@y@c@q@]kAw@aAo@{@k@{B{AgAs@e@[MOOQuBuA}@m@gAs@}ByAo@c@kAw@{ByAu@e@gAu@{ByAaC_By@i@qH_FOIOh@Y|@{AxEsA}@s@c@{B{A{AcA_@WWOGEcBgAo@pBqDnL_@tAeAs@u@e@{ByA{ByAcAq@y@k@}ByAeBgAKEYC{@m@iAs@mBqAQ?c@rAsDhLM^M`@zBzALc@~EoO'),
			geodesic: true,
			strokeColor: '#ff0000',
			strokeOpacity: 1.0,
			strokeWeight: 2
		});
		
		if (this.state.map != undefined)
			polyline.setMap(this.state.map);
		else
			console.log('this.state.map is undefined?');
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