import * as React from 'react';
import {BusMap, BusType, StopType} from './components/BusMap';
import {SideBar} from './components/SideBar';
import {getAllStops} from './components/api';
import './App.css';

const ORIGIN = {lat: 0.0, lng: 0.0};

interface AppState {
	busses: BusType[];
	allStops: Map<number, StopType>;
	activeStops: StopType[];
}

export default class App extends React.Component<{}, AppState> {
	state = {
		busses: [{location: ORIGIN, ID: '256'}],
		allStops: new Map<number, StopType>(),
		activeStops: [{location: ORIGIN, ID: '256'}]
	};

	public constructor(props: Object) {
		super(props);

		getAllStops((err: any, kvStopArray: [number, StopType][]) => {
			this.state = {
				busses: [{location: ORIGIN, ID: '256'}], // TODO: hashmap[0]
				allStops: new Map<number, StopType>(kvStopArray),
				activeStops: [{location: ORIGIN, ID: '400323'}] // TODO: hashmap[0]
			};
		});
	}

	recieveFromSideBar = (busses = this.state.busses, activeStops = this.state.activeStops) => {
		this.setState({busses: busses, activeStops: activeStops});
	}

	render() {
		return (
			<div>
				<div className="SideBar">
					<SideBar
						busses={this.state.busses}
						allStops={this.state.allStops}
						activeStops={this.state.activeStops}
						onMarkerPositionsChanged={this.recieveFromSideBar}
					/>
				</div>
				<div className="BusMap">
					<BusMap
						zoom={12}
						busses={this.state.busses}
						stops={this.state.activeStops}
					/>
				</div>
			</div>
		);
	}
}