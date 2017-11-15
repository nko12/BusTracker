import * as React from 'react';
import BusMap from './components/BusMap';
import SideBar from './components/SideBar';
import LogIn from './components/LogIn';
import * as GMapReact from 'google-map-react';
import './styles/App.css';

interface AppState {
	pointA: GMapReact.Coords;
	pointB: GMapReact.Coords;
}

export default class App extends React.Component<{}, AppState> {
	public constructor(props: Object) {
		super(props);
		this.state = {
			pointA: {lat: 41.337716, lng: -74.35912},
			pointB: {lat: 40.7588528, lng: -73.9852625}
		};
	}

	recieveFromSideBar = (pointA: GMapReact.Coords, pointB: GMapReact.Coords) => {
		this.setState({pointA: pointA, pointB: pointB});
	}

	render() {
		return (
			<div>
				<LogIn />
				<div className='blurr'>
					<SideBar
						pointA={this.state.pointA}
						pointB={this.state.pointB}
						onMarkerPositionsChanged={this.recieveFromSideBar}
					/>
					<BusMap
						zoom={10}
						pointA={this.state.pointA}
						pointB={this.state.pointB}
					/>
				</div>
			</div>
		);
	}
}