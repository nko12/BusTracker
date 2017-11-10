import * as React from 'react';
import { TabsContainer, Tabs, Tab, TextField, Button } from 'react-md';
import * as GMapReact from 'google-map-react';
// API: https://react-md.mlaursen.com/components/

import {subscribeToTimer, subscribeToBus} from './api';

interface BusType {
	location: GMapReact.Coords;
	ID: String;
}

interface SideBarState {
	pointA: GMapReact.Coords;
	pointB: GMapReact.Coords;
	busses: [BusType];

	tempString: String;
}

interface SideBarProps {
	pointA: GMapReact.Coords;
	pointB: GMapReact.Coords;
	busses: [BusType];
	onMarkerPositionsChanged: (pointA: GMapReact.Coords, pointB: GMapReact.Coords, busses?: [BusType]) => void;

	tempString: String;
}

export default class SideBar extends React.Component<SideBarProps, SideBarState> {
	public constructor(props: SideBarProps) {
		super(props);
		this.state = {
			pointA: this.props.pointA,
			pointB: this.props.pointB,
			busses: this.props.busses,
			
			tempString: this.props.tempString
		};
	}
	
	render() {
		return (
			<div>
				<TabsContainer
					className="tabs__page-layout"
					panelClassName="md-grid"
				>
					<Tabs tabId="phone-stuffs">
						<Tab label="Starks">
							<h1>Winter is Coming</h1>
							<TextField
								label="Latitude A"
								value={this.state.pointA.lat}
								onChange={(value) => {
									this.setState({pointA: {lat: Number(value), lng: this.state.pointA.lng}});
								}}
							/>
							<TextField
								label="Longitude A"
								value={this.state.pointA.lng}
								onChange={(value) => {
									this.setState({pointA: {lat: this.state.pointA.lat, lng: Number(value)}});
								}}
							/>
							<TextField
								label="Latitude B"
								value={this.state.pointB.lat}
								onChange={(value) => {
									this.setState({pointB: {lat: Number(value), lng: this.state.pointB.lng}});
								}}
							/>
							<TextField
								label="Longitude B"
								value={this.state.pointB.lng}
								onChange={(value) => {
									this.setState({pointB: {lat: this.state.pointB.lat, lng: Number(value)}});
								}}
							/>
							<Button
								flat={true}
								primary={true}
								onClick={() => {
									this.props.onMarkerPositionsChanged(this.state.pointA, this.state.pointB);
								}}
							>
							Get Directions
							</Button>
							<Button
								flat={true}
								primary={true}
								onClick={() => {
									console.log('TODO: Get Route');
								}}
							>
							Get Route
							</Button>
							<Button
								flat={true}
								primary={true}
								onClick={() => {
									subscribeToTimer(1000, (err: any, busses: any) => {
										var newBusses: [BusType] = [{location: busses[0], ID: 'nil'}];
										for (var i = 1; i < busses.length; i++)
											newBusses.push({location: busses[i], ID: 'nil'});
										this.setState({busses: newBusses});
										this.props.onMarkerPositionsChanged(this.state.pointA, this.state.pointB, this.state.busses);
									});
								}}
							>
							Get Busses
							</Button>
							<Button
								flat={true}
								primary={true}
								onClick={() => {
									subscribeToBus({interval: 1000, ID: this.state.busses[0].ID}, (err: any, busLoc: GMapReact.Coords) => {
										console.log(JSON.stringify(busLoc));
										var busses: [BusType] = [{location: busLoc, ID: this.state.busses[0].ID}]
										this.setState({busses: busses});
										this.props.onMarkerPositionsChanged(this.state.pointA, this.state.pointB, this.state.busses);
									});
								}}
							>
							Get Bus
							</Button>
							<Button
								flat={true}
								primary={true}
								onClick={() => {
									console.log('TODO: Get Stops');
								}}
							>
							Get Stop
							</Button>
							<p> state: {this.state.tempString} </p>
						</Tab>
						<Tab label="Targaryans"><h1>Fire and Blood</h1></Tab>
						<Tab label="Lannisters"><h1>A Lannister Always Pays His Debts</h1></Tab>
					</Tabs>
				</TabsContainer>
			</div>
		);
	}
}