import * as React from 'react';
import * as GoogleMapReact from 'google-map-react';
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
	allStops: Map<number, StopType>;

	busses: BusType[];
	activeStops: StopType[];

	polyString: string;
}

export interface SideBarProps {
	allStops: Map<number, StopType>;

	busses: BusType[];
	activeStops: StopType[];

	polyString: string;

	sendToParent: (busses: BusType[], stops: StopType[], polystring: string) => void;
}

export class SideBar extends React.Component<SideBarProps, SideBarState> {
	public constructor(props: SideBarProps) {
		super(props);
		this.state = {
			allStops: props.allStops,

			busses: props.busses,
			activeStops: props.activeStops,

			polyString: props.polyString
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
								onChange={(value: any) => {
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
									subscribeToBus({interval: 1000, busID: this.state.busses[0].ID}, (err: any, busLoc: GoogleMapReact.Coords) => {
										let busses: BusType[] = [{location: busLoc, ID: this.state.busses[0].ID}];
										this.setState({busses: busses, polyString: 'ybpwFvxsbMuC_CUKWMaBe@gCo@A?_@Eg@O}DkAo@e@oCuB{BeBYSSOgCmBaAo@iAw@QKoBuAsBaBq@g@oI}GKIc@oAuBsAe@]}ASmCc@}B_@YEyC_@qACC?eADa@JgBRm@CWSs@e@AA{@g@MKm@c@aAm@KMq@e@y@i@uBqAsBwAuBsAYSaBgAcC_BgAs@}@m@yByAITsBrGIZ}B{AyByA{ByAm@a@mAw@{ByA{@k@}@m@{ByA{ByAeCaBwBwAMGyByA{ByAeBiASO}ByA{ByAmBqAMIcC_BqBuASM{ByA}B{AmBoAOK{ByAqBsAKG}B{AoBqAKG}B{A}B{AoBoAMI{B{A{B{AoBoAMIeCcByBwAMI{ByA}B{AeBiAUQ}ByA}B{Ak@_@oAy@}B{AiBmAQM}B{As@c@gAu@}B{Au@e@gAu@{ByAiCcBoA{@w@g@}B{A_C{A[UaBgA_C{AeAs@w@g@gCcBsA{@u@g@}B{A_C{AmBqAOK}B{A_C}AgCaBcAq@cAq@{ByAoBoAMK}B{A}B{AeAs@u@e@}B}AkAu@q@c@}B{AuA}@o@c@gCaBkBqAQK}B{AkFiDMK}B{AgAu@u@e@gBkAUM}B}AkBmAYSgCaB{@m@_Am@}B{A}@m@_Am@}B{Au@e@kAw@yE}CuCoB{@i@oA{@gCaB}B{Aq@e@iAu@gAs@y@c@q@]kAw@aAo@{@k@{B{AgAs@e@[MOOQuBuA}@m@gAs@}ByAo@c@kAw@{ByAu@e@gAu@{ByAaC_By@i@qH_FOIOh@Y|@{AxEsA}@s@c@{B{A{AcA_@WWOGEcBgAo@pBqDnL_@tAeAs@u@e@{ByA{ByAcAq@y@k@}ByAeBgAKEYC{@m@iAs@mBqAQ?c@rAsDhLM^M`@zBzALc@~EoO'});
										this.props.sendToParent(this.state.busses, this.state.activeStops, this.state.polyString);
									});
								}}
							>
							Get Bus
							</Button>
							<TextField
								label="StopID"
								value={this.state.activeStops[0].ID}
								onChange={(value: any) => {
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
									getStop(this.state.activeStops[0].ID, (err: any, stopLoc: GoogleMapReact.Coords) => {
										let stops: StopType[] = [{location: stopLoc, ID: this.state.activeStops[0].ID, name: this.state.activeStops[0].name}];
										this.setState({activeStops: stops});
										this.props.sendToParent(this.state.busses, this.state.activeStops, this.state.polyString);
									});

									subscribeToStop({interval: 1000, stopID: this.state.activeStops[0].ID}, (err: any, busObjs: BusType[]) => {
										let busses: BusType[] = [];
										for (let i = 0; i < busObjs.length; i++) {
											busses.push({location: busObjs[i].location, ID: busObjs[i].ID.split('_')[1]});
										}
											
										this.setState({busses: busses});
										this.props.sendToParent(this.state.busses, this.state.activeStops, this.state.polyString);
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