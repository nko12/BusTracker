import * as React from 'react';
import * as GMapReact from 'google-map-react';
import {TabsContainer, Tabs, Tab, TextField, Button} from 'react-md';
import {getStop, subscribeToStop, subscribeToBus} from './api';
import {BusType, StopType} from './BusMap';

export interface SideBarState {
	busses: BusType[];
	stops: StopType[];
}

export interface SideBarProps {
	busses: BusType[];
	stops: StopType[];
	onMarkerPositionsChanged: (busses: BusType[], stops: StopType[]) => void;
}

export class SideBar extends React.Component<SideBarProps, SideBarState> {
	public constructor(props: SideBarProps) {
		super(props);
		this.state = {
			busses: this.props.busses,
			stops: this.props.stops,
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
								label='BusID'
								value={this.state.busses[0].ID}
								onChange={(value) => {
									var busses = this.state.busses;
									busses[0].ID = String(value);
									this.setState({busses: busses});
								}}
							/>
							<Button
								flat={true}
								primary={true}
								onClick={() => {
									subscribeToBus({interval: 10000, busID: this.state.busses[0].ID}, (err: any, busLoc: GMapReact.Coords) => {
										console.log(JSON.stringify(busLoc));
										var busses: [BusType] = [{location: busLoc, ID: this.state.busses[0].ID}]
										this.setState({busses: busses});
										this.props.onMarkerPositionsChanged(this.state.busses, this.state.stops);
									});
								}}
							>
							Get Bus
							</Button>
							<TextField
								label='StopID'
								value={this.state.stops[0].ID}
								onChange={(value) => {
									var stops = this.state.stops;
									stops[0].ID = String(value);
									this.setState({stops: stops});
								}}
							/>
							<Button
								flat={true}
								primary={true}
								onClick={() => {
									// TODO: ask the DB for this. No need to spend an API call on something that remains static
									getStop(this.state.stops[0].ID, (err: any, stopLoc: GMapReact.Coords) => {
										var stops: StopType[] = [{location: stopLoc, ID: this.state.stops[0].ID}];
										this.setState({stops: stops});
										this.props.onMarkerPositionsChanged(this.state.busses, this.state.stops);
									});

									console.log('about to subscribe to stop: ' + JSON.stringify(this.state.stops));
									subscribeToStop({interval: 10000, stopID: this.state.stops[0].ID}, (err: any, busObjs: BusType[]) => {
										console.log('got busses: ' + JSON.stringify(busObjs));
										var busses: BusType[] = [];
										for (var i = 0; i < busObjs.length; i++)
											busses.push({location: busObjs[i].location, ID: busObjs[i].ID.split('_')[1]});
										this.setState({busses: busses});
										this.props.onMarkerPositionsChanged(this.state.busses, this.state.stops);
									});
								}}
							>
							Get Stop
							</Button>
							<p> SideBar.state = {JSON.stringify(this.state)} </p>
						</Tab>
						<Tab label='Targaryans'><h1>Fire and Blood</h1></Tab>
						<Tab label='Lannisters'><h1>A Lannister Always Pays His Debts</h1></Tab>
					</Tabs>
				</TabsContainer>
			</div>
		);
	}
}