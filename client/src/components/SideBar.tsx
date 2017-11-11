import * as React from 'react';
import { TabsContainer, Tabs, Tab, TextField, Button } from 'react-md';
import * as GMapReact from 'google-map-react';
// API: https://react-md.mlaursen.com/components/

import {getStop, subscribeToStop, subscribeToBus} from './api';

interface BusType {
	location: GMapReact.Coords;
	ID: String;
}

interface StopType {
	location: GMapReact.Coords;
	ID: String;
}

interface SideBarState {
	pointA: GMapReact.Coords;
	pointB: GMapReact.Coords;
	busses: BusType[];
	stops: StopType[];

	tempString: String;
}

interface SideBarProps {
	pointA: GMapReact.Coords;
	pointB: GMapReact.Coords;
	busses: BusType[];
	stops: StopType[];
	onMarkerPositionsChanged: (pointA: GMapReact.Coords, pointB: GMapReact.Coords, busses?: BusType[], stops?: StopType[]) => void;

	tempString: String;
}

export default class SideBar extends React.Component<SideBarProps, SideBarState> {
	public constructor(props: SideBarProps) {
		super(props);
		this.state = {
			pointA: this.props.pointA,
			pointB: this.props.pointB,
			busses: this.props.busses,
			stops: this.props.stops,
			
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
									subscribeToBus({interval: 1000, busID: this.state.busses[0].ID}, (err: any, busLoc: GMapReact.Coords) => {
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
									getStop(this.state.stops[0].ID, (err: any, stopLoc: GMapReact.Coords) => {
										var stops: StopType[] = [{location: stopLoc, ID: this.state.stops[0].ID}];
										this.setState({stops: stops});
										this.props.onMarkerPositionsChanged(this.state.pointA, this.state.pointB, this.state.busses, this.state.stops);
									});

									console.log('about to subscribe to stop: ' + JSON.stringify(this.state.stops));
									subscribeToStop({interval: 1000, stopID: this.state.stops[0].ID}, (err: any, busLocs: [GMapReact.Coords]) => {
										console.log('got busses: ' + JSON.stringify(busLocs));
										var busses: BusType[] = [];
										for (var i = 0; i < this.state.busses.length; i++)
											busses.push({location: busLocs[i], ID: 'nil'});
										this.setState({busses: busses});
										this.props.onMarkerPositionsChanged(this.state.pointA, this.state.pointB, this.state.busses);
									});
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