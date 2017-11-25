import * as React from 'react';
/* import * as GoogleMapReact from 'google-map-react'; */
import { BusTrackerEvents } from '../BusTrackerEvents';
import { appState } from '../BusTrackerState';
import { BusStop } from '../models/BusStop';
import { Route } from '../models/Route';
import { CardText, TabsContainer, Tabs, Tab, TextField, Button } from 'react-md';
import { FontIcon, SelectionControlGroup } from 'react-md';
// import {getStop, /* getStopsFromBus, */ subscribeToStop, subscribeToBus} from './api';
/* import {BusType, StopType} from './BusMap'; */

const bus = <FontIcon>star</FontIcon>;

export interface SideBarState {
	/* allStops: Map<number, StopType>;

	busses: BusType[];
	activeStops: StopType[];

	polyString: string; */

	favoriteBusStops: Array<BusStop>;
	favoriteRoutes: Array<Route>;
	detectedBusStops: Array<BusStop>;
	detectedRoutes: Array<Route>;
	selectedTabId: string;
}

export interface SideBarProps {
	/* allStops: Map<number, StopType>;

	busses: BusType[];
	activeStops: StopType[];

	polyString: string;

	sendToParent: (busses: BusType[], stops: StopType[], polystring: string) => void; */
}

export class SideBar extends React.Component<SideBarProps, SideBarState> {
	public constructor(props: SideBarProps) {
		super(props);
		this.state = {
			/* allStops: props.allStops,

			busses: props.busses,
			activeStops: props.activeStops,

			polyString: props.polyString */

			favoriteBusStops: new Array<BusStop>(),
			favoriteRoutes: new Array<Route>(),
			detectedBusStops: new Array<BusStop>(),
			detectedRoutes: new Array<Route>(),
			selectedTabId: 'tabBusStops'
		};

		this.onLogin = this.onLogin.bind(this);
	}

	public componentDidMount(): void {
		BusTrackerEvents.login.loginSucceeded.add(this.onLogin);
	}

	private async onLogin(): Promise<void> {

		// Get the list of bus stops that are nearby.
		const busStopResult = await appState.api.getBusStopsNearLocation({ lat: 40.7588528, lng: -73.9852625 });
		if (!busStopResult.success) {

		}

		// Get the list of bus stops that the user has favorited, and request them from the server.
		const favoriteBusStopResult = await appState.api.getBusStops(appState.user.favoriteStopIds);
		if (!favoriteBusStopResult.success) {

		}

		// Get the list of routes that are nearby.
		const routeResult = await appState.api.getRoutesNearLocation({ lat: 40.7588528, lng: -73.9852625 });
		if (!routeResult.success) {

		}

		// Get the list of routes that the user has favorited, and request them from the server.
		const favoriteRouteResult = await appState.api.getRoutes(appState.user.favoriteStopIds);
		if (!favoriteRouteResult.success) {

		}

		// TODO: Remove duplicates between what is nearby and what the user has favorited.
		this.setState({
			favoriteBusStops: favoriteBusStopResult.data, detectedBusStops: busStopResult.data,
			favoriteRoutes: favoriteRouteResult.data, detectedRoutes: routeResult.data
		});
	}

	render() {
		return (
			<div style={{overflow: 'auto'}}>
					<TabsContainer
						className="tabs__page-layout"
						panelClassName="md-grid"
					>
						<Tabs tabId="phone-stuffs">
							<Tab label="Stops" id={'tabBusStops'}>
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
									controls={this.state.favoriteBusStops.map((stop: BusStop) => {
										return { label: stop.name, value: stop.id };
									})}
								/>
								{/* Nearby Stops List*/}
								<SelectionControlGroup
									className="listlayout"
									id="nearby-checkbox"
									name="nearby"
									type="checkbox"
									label="Nearby Stops"
									checkedCheckboxIcon={bus}
									controls={this.state.detectedBusStops.map((stop: BusStop) => {
										return { label: stop.name, value: stop.id };
									})}
								/>

								{/* <TextField
								label={'BusID'}
								value={this.state.busses[0].ID}
								onChange={(value: any) => {
									let busses = this.state.busses;
									busses[0].ID = String(value);
									this.setState({busses: busses});
								}}
							/> */}

								<CardText />
								{/* <Button
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
							</Button> */}
							</Tab>

							<Tab label="Routes" id={'tabRoutes'}>
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
									controls={this.state.favoriteRoutes.map((route: Route) => {
										return { label: route.name, value: route.id };
									})}
								/>

								{/* Nearby Routes List*/}
								<SelectionControlGroup
									className="listlayout"
									id="nearby-checkbox-2"
									name="nearby-2"
									type="checkbox"
									label="Nearby Routes"
									checkedCheckboxIcon={bus}
									controls={this.state.detectedRoutes.map((route: Route) => {
										return { label: route.name, value: route.id };
									})}
								/>
							</Tab>

							<Tab label="Buses" id='tabBuses'>
								<h3>Busses</h3>

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
					<Button
						raised
						onClick={(evt) => BusTrackerEvents.login.logoutRequested.dispatch()}
					>
						Logout
				</Button>
			</div>
		);
	}
}