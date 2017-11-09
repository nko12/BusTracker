import * as React from 'react';
import BusMap from './components/BusMap';
import SideBar from './components/SideBar';
import * as GMapReact from 'google-map-react';
import './App.css';

interface AppState {
	pointA: GMapReact.Coords;
	pointB: GMapReact.Coords;
	busses: [GMapReact.Coords];
	tempPoint: GMapReact.Coords;
}

export default class App extends React.Component<{}, AppState> {
	public constructor(props: Object) {
		super(props);
		this.state = {
			pointA: {lat: 41.337716, lng: -74.35912},
			pointB: {lat: 40.7588528, lng: -73.9852625},
			busses: [{lat: 0, lng: 0}],
			tempPoint: {lat: 0, lng: 0}
		};
	}

	recieveFromSideBar = (pointA: GMapReact.Coords, pointB: GMapReact.Coords, busses = this.state.busses) => {
		this.setState({pointA: pointA, pointB: pointB, busses: busses});
	}

	render() {
		return (
			<div>
				<div className="SideBar">
					<SideBar
						pointA={this.state.pointA}
						pointB={this.state.pointB}
						busses={this.state.busses}
						tempPoint={this.state.tempPoint}
						onMarkerPositionsChanged={this.recieveFromSideBar}
					/>
				</div>
				<div className="BusMap">
					<BusMap
						zoom={10}
						pointA={this.state.pointA}
						pointB={this.state.pointB}
						busses={this.state.busses}
						tempPoint ={this.state.tempPoint}
					/>
				</div>
			</div>
		);
	}
}