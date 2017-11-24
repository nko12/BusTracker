import * as React from 'react';
import * as GMapReact from 'google-map-react';
import { CardText, TabsContainer, Tabs, Tab, TextField, Button } from 'react-md';
import { FontIcon, SelectionControlGroup } from 'react-md';
import { getStop, /*getStopsFromBus,*/ subscribeToStop, subscribeToBus } from './api';
import { BusType, StopType } from './BusMap';

const bus = <FontIcon>star</FontIcon>;
// const checkboxControls = [{
// 	label: 'Orlando Bus',
// 	value: '1',
// 	checkedCheckboxIcon: bus,
// }, {
// 	label: 'Tampa Bus',
// 	value: '2',
//    },
//    {
// 	   label: 'Miami Bus',
// 	   value: '3',
//    }];

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
						<Tab label="Stops">
							<h3>Bus Stops</h3>

							{/*Simple Search Bar*/}
							<TextField
									placeholder="Search Stops"
									type="search"
							/>

							{/*Current Favorites List*/}
							<SelectionControlGroup
								className="listlayout"
								id="favorites-checkbox"
								name="favorites"
								type="checkbox"
								label="Favorites"
								defaultValue="A,B,C"
								checkedCheckboxIcon={bus}
								controls={[
									{
										label: 'Orlando Stop',
										value: 'A',
									},
									{
										label: 'Tampa Stop',
										value: 'B',
									},
									{
										label: 'Miami Stop',
										value: 'C',
									}
								]}
							/>
							{/* Nearby Stops List*/}
							<SelectionControlGroup 
								className="listlayout"
								id="nearby-checkbox"
								name="nearby"
								type="checkbox"
								label="Nearby Stops"
								checkedCheckboxIcon={bus}
								controls={[
									{
										label: 'Austin Stop',
										value: '1',
									},
									{
										label: 'Seattle Stop',
										value: '2',
									},
									{
										label: 'San Francisco Stop',
										value: '3',
									}
								]}
							/>
							
							<TextField
								label={'BusID'}
								value={this.state.busses[0].ID}
								onChange={(value) => {
									let busses = this.state.busses;
									busses[0].ID = String(value);
									this.setState({busses: busses});
								}}
							/>
							
							<CardText />
							<Button
								flat={true}
								primary={true}
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
								label="StopID"
								value={this.state.activeStops[0].ID}
								onChange={(value) => {
									let stops = this.state.activeStops;
									stops[0].ID = String(value);
									this.setState({activeStops: stops});
								}}
							/>
							<Button
								flat={true}
								primary={true}
								onClick={() => {
									// TODO: ask the DB for this. No need to spend an API call on something that remains static
									getStop(this.state.activeStops[0].ID, (err: any, stopLoc: GMapReact.Coords) => {
										let stops: StopType[] = [{location: stopLoc, ID: this.state.activeStops[0].ID}];
										this.setState({activeStops: stops});
										this.props.onMarkerPositionsChanged(this.state.busses, this.state.activeStops);
									});

									subscribeToStop({interval: 1000, stopID: this.state.activeStops[0].ID}, (err: any, busObjs: BusType[]) => {
										let busses: BusType[] = [];
										for (let i = 0; i < busObjs.length; i++) {
											busses.push({location: busObjs[i].location, ID: busObjs[i].ID.split('_')[1]});
										}
											
										this.setState({busses: busses});
										this.props.onMarkerPositionsChanged(this.state.busses, this.state.activeStops);
									});
								}}
							>
							Get Stop
							</Button>
						</Tab>
						
						<Tab label="Routes">
							<h3>Bus Routes</h3>

							{/*Simple Search Bar*/}
							<TextField
									placeholder="Search Routes"
									type="search"
							/>

							{/*Current Favorites List*/}
							<SelectionControlGroup
								className="listlayout"
								id="favorites-checkbox-2"
								name="favorites-2"
								type="checkbox"
								label="Favorite Routes"
								defaultValue="a,b,c"
								checkedCheckboxIcon={bus}
								controls={[
								{
									label: 'Orlando Route',
									value: 'a',
								},
								{
									label: 'Tampa Route',
									value: 'b',
								},
								{
									label: 'Miami Route',
									value: 'c',
								}
								]}
							/>

						{/* Nearby Routes List*/}
						<SelectionControlGroup 
							className="listlayout"
							id="nearby-checkbox-2"
							name="nearby-2"
							type="checkbox"
							label="Nearby Routes"
							checkedCheckboxIcon={bus}
							controls={[
								{
									label: 'Austin Route',
									value: '11',
								},
								{
									label: 'Seattle Route',
									value: '22',
								},
								{
									label: 'San Francisco Route',
									value: '33',
								}
							]}
						/>
						</Tab>

						<Tab label="Buses">
							<h3>Buses</h3>

							{/*Simple Search Bar*/}
							<TextField
									placeholder="Search Buses"
									type="search"
							/>

							{/*Current Favorites List*/}
							<SelectionControlGroup
								className="listlayout"
								id="favorites-checkbox-3"
								name="favorites-3"
								type="checkbox"
								label="Favorite Buses"
								defaultValue="AAA,BBB,CCC"
								checkedCheckboxIcon={bus}
								controls={[
									{
										label: 'Orlando Bus',
										value: 'AAA',
									},
									{
										label: 'Tampa Bus',
										value: 'BBB',
									},
									{
										label: 'Miami Bus',
										value: 'CCC',
									}
								]}
							/>

							{/* Nearby Buses List*/}
							<SelectionControlGroup 
								className="listlayout"
								id="nearby-checkbox-3"
								name="nearby-3"
								type="checkbox"
								label="Nearby Buses"
								checkedCheckboxIcon={bus}
								controls={[
									{
										label: 'Austin Bus',
										value: '111',
									},
									{
										label: 'Seattle Bus',
										value: '222',
									},
									{
										label: 'San Francisco Bus',
										value: '333',
									}
								]}
							/>

						</Tab>
					</Tabs>
				</TabsContainer>
			</div>
		);
	}
}