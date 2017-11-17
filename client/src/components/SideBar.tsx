import * as React from 'react';
import * as GMapReact from 'google-map-react';
import {TabsContainer, Tabs, Tab, TextField, Button} from 'react-md';
import {getStop, /*getStopsFromBus,*/ subscribeToStop, subscribeToBus} from './api';
import {BusType, StopType} from './BusMap';

export interface SideBarState {
	busses: BusType[];
	allStops: Map<number, StopType>;
	activeStops: StopType[];
}

export interface SideBarProps {
	busses: BusType[];
	allStops: Map<number, StopType>;
	activeStops: StopType[];
	onMarkerPositionsChanged: (busses: BusType[], activeStops: StopType[]) => void;
}

export class SideBar extends React.Component<SideBarProps, SideBarState> {
	public constructor(props: SideBarProps) {
		super(props);
		this.state = {
			busses: this.props.busses,
			allStops: this.props.allStops,
			activeStops: this.props.activeStops
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
									let busses = this.state.busses;
									busses[0].ID = String(value);
									this.setState({busses: busses});
								}}
							/>
							<Button
								flat
								primary
								onClick={() => {
									{/*getStopsFromBus(this.state.busses[0].ID, (err: any, stopIDs: string[]) => {
										console.log(JSON.stringify(stopIDs));
										let stops: StopType[] = [];
										for (var i = 0; i < stopIDs.length; i++) {
											let key = parseInt(stopIDs[i].split('_')[1]);
											let stop = this.state.allStops.get(key);
											console.log('searched map for ' + key + ' and found ' + stop);
											if (stop != undefined)
												stops.push({ID: stopIDs[i], location: stop.location})
											console.log(stops);
											this.setState({activeStops: stops});
											this.props.onMarkerPositionsChanged(this.state.busses, this.state.activeStops);
										}
									});*/}
									subscribeToBus({interval: 1000, busID: this.state.busses[0].ID}, (err: any, busLoc: GMapReact.Coords) => {
										let busses: BusType[] = [{location: busLoc, ID: this.state.busses[0].ID}];
										this.setState({busses: busses});
										this.props.onMarkerPositionsChanged(this.state.busses, this.state.activeStops);
									});
								}}
							>
							Get Bus
							</Button>
							<TextField
								label='StopID'
								value={this.state.activeStops[0].ID}
								onChange={(value) => {
									let stops = this.state.activeStops;
									stops[0].ID = String(value);
									this.setState({activeStops: stops});
								}}
							/>
							<Button
								flat
								primary
								onClick={() => {
									// TODO: ask the DB for this. No need to spend an API call on something that remains static
									getStop(this.state.activeStops[0].ID, (err: any, stopLoc: GMapReact.Coords) => {
										let stops: StopType[] = [{location: stopLoc, ID: this.state.activeStops[0].ID}];
										this.setState({activeStops: stops});
										this.props.onMarkerPositionsChanged(this.state.busses, this.state.activeStops);
									});

									subscribeToStop({interval: 1000, stopID: this.state.activeStops[0].ID}, (err: any, busObjs: BusType[]) => {
										let busses: BusType[] = [];
										for (let i = 0; i < busObjs.length; i++)
											busses.push({location: busObjs[i].location, ID: busObjs[i].ID.split('_')[1]});
										this.setState({busses: busses});
										this.props.onMarkerPositionsChanged(this.state.busses, this.state.activeStops);
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