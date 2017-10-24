import * as React from 'react';
import BusMap from './components/BusMap';
import SideBar from './components/SideBar';
// import {TabsContainer, Tabs, Tab} from 'react-md';
import './App.css';

// const logo = require('./logo.svg');

export default class App extends React.Component {
	state = {
		pointA: {lat: 41.337716, lng: -74.35912},
		pointB: {lat: 40.7588528, lng: -73.9852625},
	}

	// awesome thing about arrow functions is they bind your context for you
	myCallBack = (pointA: any, pointB: any) => {
		this.setState({pointA: pointA, pointB: pointB});
	}

	render() {
		return (
			<div>
				<div className="SideBar">
					<SideBar pointA={this.state.pointA} pointB={this.state.pointB} callBackFunction={this.myCallBack}/>
				</div>
				<div className="BusMap">
					<BusMap
						defaultZoom={15}
						pointA={this.state.pointA}
						pointB={this.state.pointB}
					/>
				</div>
			</div>
		);
	}
}