import * as React from 'react';
import BusMap from './components/BusMap';
import SideBar from './components/SideBar';
import './App.css';

export default class App extends React.Component {
	state = {
		pointA: {lat: 41.337716, lng: -74.35912},
		pointB: {lat: 40.7588528, lng: -73.9852625}
	};

	recieveFromSideBar = (pointA: any, pointB: any) => {
		this.setState({pointA: pointA, pointB: pointB});
	}

	render() {
		return (
			<div>
				<div className='SideBar'>
					<SideBar
						pointA={this.state.pointA}
						pointB={this.state.pointB}
						sendToApp={this.recieveFromSideBar}
					/>
				</div>
				<div className='BusMap'>
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