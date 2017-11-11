import * as React from 'react';
import {BusMap, BusType, StopType} from './components/BusMap';
import {SideBar} from './components/SideBar';
import './App.css';

interface AppState {
	busses: BusType[];
	stops: StopType[];
}

export default class App extends React.Component<{}, AppState> {
	public constructor(props: Object) {
		super(props);
		this.state = {
			busses: [{location: {lat: 0, lng: 0}, ID: '256'}],
			stops: [{location: {lat: 0, lng: 0}, ID: '400323'}]
		};
	}

	recieveFromSideBar = (busses = this.state.busses, stops = this.state.stops) => {
		this.setState({busses: busses, stops: stops});
	}

	render() {
		return (
			<div>
				<div className="SideBar">
					<SideBar
						busses={this.state.busses}
						stops={this.state.stops}
						onMarkerPositionsChanged={this.recieveFromSideBar}
					/>
				</div>
				<div className="BusMap">
					<BusMap
						zoom={10}
						busses={this.state.busses}
						stops={this.state.stops}
					/>
				</div>
			</div>
		);
	}
}