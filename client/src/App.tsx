import * as React from 'react';
import * as GoogleMapReact from 'google-map-react'
import {BusMap, BusType, StopType} from './components/BusMap';
import {SideBar} from './components/SideBar';
import {getAllStops} from './components/api';
import './App.css';

const ORIGIN = {lat: 0.0, lng: 0.0};
const NYC = {lat: 40.7588528, lng: -73.9852625};

interface AppState {
	busses: BusType[];
	allStops: Map<number, StopType>;
	activeStops: StopType[];
	currentLocation: GoogleMapReact.Coords;
	polystring: string;
}

export default class App extends React.Component<{}, AppState> {
	state = {
		busses: [{location: ORIGIN, ID: '256'}],
		allStops: new Map<number, StopType>(),
		activeStops: [{location: ORIGIN, ID: '256'}],
		currentLocation: NYC,
		polystring: '',
	};

	public constructor(props: Object) {
		super(props);

		getAllStops((err: any, kvStopArray: [number, StopType][]) => {
			this.state = {
				busses: [{location: ORIGIN, ID: '256'}], // TODO: hashmap[0]
				allStops: new Map<number, StopType>(kvStopArray),
				activeStops: [{location: ORIGIN, ID: '400323'}], // TODO: hashmap[0]
				currentLocation: NYC,
				polystring: '',
			};
		});

		navigator.geolocation.getCurrentPosition((position: any) => {
			this.setState({currentLocation: {lat: position.coords.latitude, lng: position.coords.longitude}});
		});
	}

	recieveFromSideBar = (busses = this.state.busses, activeStops = this.state.activeStops, polystring = this.state.polystring) => {
		this.setState({busses: busses, activeStops: activeStops, polystring: polystring});
	}

	render() {
		return (
			<div>
				<div className="SideBar">
					<SideBar
						busses={this.state.busses}
						allStops={this.state.allStops}
						activeStops={this.state.activeStops}
						polystring={this.state.polystring}
						onMarkerPositionsChanged={this.recieveFromSideBar}
					/>
				</div>
				<div className="BusMap">
					<BusMap
						zoom={12}
						busses={this.state.busses}
						stops={this.state.activeStops}
						polystring={this.state.polystring}
					/>
				</div>
			</div>
		);
	}
}