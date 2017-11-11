import * as React from 'react';
import { TabsContainer, CardText, TextField, SelectionControlGroup, Tabs, Tab, Button } from 'react-md';
import * as GMapReact from 'google-map-react';
// API: https://react-md.mlaursen.com/components/

//import {subscribeToTimer, subscribeToBus} from './api';

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
						<Tab label="Stops">
							
								
								<TextField
									//toolbar
									placeholder = "Search"
									type = "search"
								/>
								
							<SelectionControlGroup 
    							type="radio"
    							label="Select stops to add: "
    							defaultValue=" "
								className="tabFormat"
    							controls={[{
      								label: 'Stop 1: ',
      								value: 'A',
    								}, {
      									label: 'Stop 2: ',
      									value: 'B',
    								}, {
      									label: 'Stop 3: ',
      									value: 'C',
    								}]}
							/>
							
							<CardText> </CardText>
							<Button
								raised={true}
								primary={true}
								onClick={() => {
									this.props.onMarkerPositionsChanged(this.state.pointA, this.state.pointB);
								}}
							>
							Add to Favorites
							</Button>
							{/* <Button
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
							</Button> */}
						</Tab>
						<Tab label="Favorites">
							<h3>Search Favorites</h3>
						</Tab>
						<Tab label="Buses">
							<h3>Search Buses</h3>
						</Tab>
					</Tabs>
				</TabsContainer>
			</div>
		);
	}
}