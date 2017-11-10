import * as React from 'react';
import BusMap from './components/BusMap';
import SideBar from './components/SideBar';
import * as GMapReact from 'google-map-react';
import './App.css';

interface BusType {
	location: GMapReact.Coords;
	ID: String;
}

interface StopType {
	location: GMapReact.Coords;
	ID: String;
}

interface AppState {
	pointA: GMapReact.Coords;
	pointB: GMapReact.Coords;
	busses: [BusType];
	stops: [StopType];

	tempString: String;
}

export default class App extends React.Component<{}, AppState> {
	public constructor(props: Object) {
		super(props);
		this.state = {
			pointA: {lat: 41.337716, lng: -74.35912},
			pointB: {lat: 40.7588528, lng: -73.9852625},
			busses: [{location: {lat: 0, lng: 0}, ID: '512'}],
			stops: [{location: {lat: 0, lng: 0}, ID: '400323'}],

			tempString: 'no string from socket yet'
		};
	}

	recieveFromSideBar = (pointA: GMapReact.Coords, pointB: GMapReact.Coords, busses = this.state.busses, stops = this.state.stops) => {
		this.setState({pointA: pointA, pointB: pointB, busses: busses, stops: stops});
	}

	render() {
		return (
			<div>
				<div className="SideBar">
					<SideBar
						pointA={this.state.pointA}
						pointB={this.state.pointB}
						busses={this.state.busses}
						stops={this.state.stops}
						tempString={this.state.tempString}
						onMarkerPositionsChanged={this.recieveFromSideBar}
					/>
				</div>
				<div className="BusMap">
					<BusMap
						zoom={10}
						pointA={this.state.pointA}
						pointB={this.state.pointB}
						busses={this.state.busses}
						stops={this.state.stops}
					/>
				</div>
			</div>
		);
	}
}