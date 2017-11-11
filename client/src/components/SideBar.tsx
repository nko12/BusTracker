import * as React from 'react';
import * as GMapReact from 'google-map-react';
import {TabsContainer, Tabs, Tab, Button} from 'react-md';
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
							<Button
								flat={true}
								primary={true}
								onClick={() => {
									subscribeToBus({interval: 1000, busID: this.state.busses[0].ID}, (err: any, busLoc: GMapReact.Coords) => {
										console.log(JSON.stringify(busLoc));
										var busses: [BusType] = [{location: busLoc, ID: this.state.busses[0].ID}]
										this.setState({busses: busses});
										this.props.onMarkerPositionsChanged(this.state.busses, this.state.stops);
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
										this.props.onMarkerPositionsChanged(this.state.busses, this.state.stops);
									});

									console.log('about to subscribe to stop: ' + JSON.stringify(this.state.stops));
									subscribeToStop({interval: 1000, stopID: this.state.stops[0].ID}, (err: any, busLocs: [GMapReact.Coords]) => {
										console.log('got busses: ' + JSON.stringify(busLocs));
										var busses: BusType[] = [];
										for (var i = 0; i < this.state.busses.length; i++)
											busses.push({location: busLocs[i], ID: 'nil'});
										this.setState({busses: busses});
										this.props.onMarkerPositionsChanged(this.state.busses, this.state.stops);
									});
								}}
							>
							Get Stop
							</Button>
							<p> SideBar.state = {JSON.stringify(this.state)} </p>
						</Tab>
						<Tab label="Targaryans"><h1>Fire and Blood</h1></Tab>
						<Tab label="Lannisters"><h1>A Lannister Always Pays His Debts</h1></Tab>
					</Tabs>
				</TabsContainer>
			</div>
		);
	}
}