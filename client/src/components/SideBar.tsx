import * as React from 'react';
import * as GoogleMapReact from 'google-map-react';
import {TabsContainer, Tabs, Tab, TextField, Button} from 'react-md';
import {getStop, /*getStopsFromBus,*/ subscribeToStop, subscribeToBus} from './api';
import {BusType, StopType} from './BusMap';

export interface SideBarState {
	busses: BusType[];
	allStops: Map<number, StopType>;
	activeStops: StopType[];
	polystring: string;
}

export interface SideBarProps {
	busses: BusType[];
	allStops: Map<number, StopType>;
	activeStops: StopType[];
	polystring: string;
	onMarkerPositionsChanged: (busses: BusType[], activeStops: StopType[], polystring: string) => void;
}

export class SideBar extends React.Component<SideBarProps, SideBarState> {
	public constructor(props: SideBarProps) {
		super(props);
		this.state = {
			busses: props.busses,
			allStops: props.allStops,
			activeStops: props.activeStops,
			polystring: props.polystring
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
									subscribeToBus({interval: 1000, busID: this.state.busses[0].ID}, (err: any, busLoc: GoogleMapReact.Coords) => {
										let busses: BusType[] = [{location: busLoc, ID: this.state.busses[0].ID}];
										this.setState({busses: busses, polystring: 'ybpwFvxsbMuC_CUKWMaBe@gCo@A?_@Eg@O}DkAo@e@oCuB{BeBYSSOgCmBaAo@iAw@QKoBuAsBaBq@g@oI}GKIc@oAuBsAe@]}ASmCc@}B_@YEyC_@qACC?eADa@JgBRm@CWSs@e@AA{@g@MKm@c@aAm@KMq@e@y@i@uBqAsBwAuBsAYSaBgAcC_BgAs@}@m@yByAITsBrGIZ}B{AyByA{ByAm@a@mAw@{ByA{@k@}@m@{ByA{ByAeCaBwBwAMGyByA{ByAeBiASO}ByA{ByAmBqAMIcC_BqBuASM{ByA}B{AmBoAOK{ByAqBsAKG}B{AoBqAKG}B{A}B{AoBoAMI{B{A{B{AoBoAMIeCcByBwAMI{ByA}B{AeBiAUQ}ByA}B{Ak@_@oAy@}B{AiBmAQM}B{As@c@gAu@}B{Au@e@gAu@{ByAiCcBoA{@w@g@}B{A_C{A[UaBgA_C{AeAs@w@g@gCcBsA{@u@g@}B{A_C{AmBqAOK}B{A_C}AgCaBcAq@cAq@{ByAoBoAMK}B{A}B{AeAs@u@e@}B}AkAu@q@c@}B{AuA}@o@c@gCaBkBqAQK}B{AkFiDMK}B{AgAu@u@e@gBkAUM}B}AkBmAYSgCaB{@m@_Am@}B{A}@m@_Am@}B{Au@e@kAw@yE}CuCoB{@i@oA{@gCaB}B{Aq@e@iAu@gAs@y@c@q@]kAw@aAo@{@k@{B{AgAs@e@[MOOQuBuA}@m@gAs@}ByAo@c@kAw@{ByAu@e@gAu@{ByAaC_By@i@qH_FOIOh@Y|@{AxEsA}@s@c@{B{A{AcA_@WWOGEcBgAo@pBqDnL_@tAeAs@u@e@{ByA{ByAcAq@y@k@}ByAeBgAKEYC{@m@iAs@mBqAQ?c@rAsDhLM^M`@zBzALc@~EoO'});
										this.props.onMarkerPositionsChanged(this.state.busses, this.state.activeStops, this.state.polystring);
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
									getStop(this.state.activeStops[0].ID, (err: any, stopLoc: GoogleMapReact.Coords) => {
										let stops: StopType[] = [{location: stopLoc, ID: this.state.activeStops[0].ID}];
										this.setState({activeStops: stops});
										this.props.onMarkerPositionsChanged(this.state.busses, this.state.activeStops, this.state.polystring);
									});

									subscribeToStop({interval: 1000, stopID: this.state.activeStops[0].ID}, (err: any, busObjs: BusType[]) => {
										let busses: BusType[] = [];
										for (let i = 0; i < busObjs.length; i++)
											busses.push({location: busObjs[i].location, ID: busObjs[i].ID.split('_')[1]});
										this.setState({busses: busses});
										this.props.onMarkerPositionsChanged(this.state.busses, this.state.activeStops, this.state.polystring);
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