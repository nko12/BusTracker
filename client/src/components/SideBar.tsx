import * as React from 'react';
import {CardText, TabsContainer, Tabs, Tab, TextField, Button, FontIcon, SelectionControlGroup} from 'react-md';
import {BusTrackerEvents, SelectedObjectType} from '../BusTrackerEvents';
import {appState} from '../BusTrackerState';
// import {Bus} from './../models/Bus';
import {Stop} from './../models/Stop';
import {Route} from './../models/Route';

const favorite = <FontIcon>star</FontIcon>;
const unfavorite = <FontIcon>star_border</FontIcon>;

export interface SideBarState {
	// detectedBusses: Bus[];
	// favoriteBusses: Bus[];

	detectedStops: Stop[];
	favoriteStops: Stop[];

	detectedRoutes: Route[];
	favoriteRoutes: Route[];

	selectedTabID: string;
}

export interface SideBarProps {}

export class SideBar extends React.Component<SideBarProps, SideBarState> {
	public constructor(props: SideBarProps) {
		super(props);
		this.state = {
			// detectedBusses: [] as Bus[],
			// favoriteBusses: [] as Bus[],

			detectedStops: [] as Stop[],
			favoriteStops: [] as Stop[],

			detectedRoutes: [] as Route[],
			favoriteRoutes: [] as Route[],

			selectedTabID: 'tabStops'
		};

		this.onLogin = this.onLogin.bind(this);
	}

	public componentDidMount(): void {
		BusTrackerEvents.login.loginSucceeded.add(this.onLogin);
	}

	private async onLogin(): Promise<void> {
		// get the list ALL busses
		// const busResult = await appState.api.getAllBusses();
		// if (!busResult.success) {}

		// get list of busses that the user has favorited
		// const favoriteBusResult = await appState.api.getBusses(appState.user.favoriteBusIds);
		// if (!favoriteBusResult.success) {}

		// Get the list of stops that are nearby.
		const stopResult = await appState.api.getStopsNearLocation(appState.location);
		if (!stopResult.success) {}

		// Get the list of stops that the user has favorited, and request them from the server.
		const favoriteStopResult = await appState.api.getStops(appState.user.favoriteStopIds);
		if (!favoriteStopResult.success) {}

		// Get the list of routes that are nearby.
		const routeResult = await appState.api.getRoutesNearLocation(appState.location);
		if (!routeResult.success) {}

		// Get the list of routes that the user has favorited, and request them from the server.
		const favoriteRouteResult = await appState.api.getRoutes(appState.user.favoriteStopIds);
		if (!favoriteRouteResult.success) {}

		// TODO: Remove duplicates between what is nearby and what the user has favorited.
		this.setState({
			// detectedBusses: busResult.data,
			// favoriteBusses: favoriteBusResult.data,

			detectedStops: stopResult.data,
			favoriteStops: favoriteStopResult.data,

			detectedRoutes: routeResult.data,
			favoriteRoutes: favoriteRouteResult.data
		});
	}

	render() {
		return (
			<div style={{overflow: 'auto'}}>
					<TabsContainer
						className='tabs__page-layout'
						panelClassName='md-grid'
					>
						<Tabs tabId='phone-stuffs'>
							<Tab label='Stops' id={'tabStops'}>
								{/* Simple Search Bar */}
								<TextField
									placeholder='Search Stops'
									type='search'
								/>

								{/* Current Favorites List */}
								<SelectionControlGroup
									className='listlayout'
									id='favorites-checkbox'
									name='favorites'
									type='checkbox'
									label='Favorites'
									checkedCheckboxIcon={favorite}
									uncheckedCheckboxIcon={unfavorite}
									controls={this.state.favoriteStops.map((stop: Stop) => {
										return {label: stop.name, value: stop.id, checked: true, onChange: () => {
											// wait to play animation before moving
											setTimeout(() => {
												// remove from favorite list
												let stops = this.state.favoriteStops.slice(); // slice() performs shallow copy
												stops.splice(stops.indexOf(stop), 1);
												this.setState({favoriteStops: stops});

												// add it to detected list
												stops = this.state.detectedStops.slice();
												stops.push(stop);
												this.setState({detectedStops: stops});
											}, 250);
										}};
									})}
								/>

								{/* Nearby Stops List */}
								<SelectionControlGroup
									className='listlayout'
									id='nearby-checkbox'
									name='nearby'
									type='checkbox'
									label='Nearby Stops'
									checkedCheckboxIcon={favorite}
									uncheckedCheckboxIcon={unfavorite}
									controls={this.state.detectedStops.map((stop: Stop) => {
										return {label: stop.name, value: stop.id, checked: false, onChange: () => {
											// send to map. TODO: make this happen on radio button instead
											BusTrackerEvents.map.mapDisplayChangeRequested.dispatch({ID: stop.id, type: SelectedObjectType.Stop, location: {lat: stop.latitude, lng: stop.longitude}})

											// wait to play animation before moving
											setTimeout(() => {
												// remove from detected list
												let stops = this.state.detectedStops.slice(); // slice() performs shallow copy
												stops.splice(stops.indexOf(stop), 1);
												this.setState({detectedStops: stops});

												// add it to favorites list
												stops = this.state.favoriteStops.slice();
												stops.push(stop);
												this.setState({favoriteStops: stops});
											}, 250);
										}};
									})}
								/>
								
								{/*Add or Delete Stops*/}
								<CardText className="add-delete-button">Add or Delete Stops</CardText>
								<Button primary={true} raised={true}>+ Add New Stop</Button>
								<Button primary={true} raised={true}>- Delete Stop</Button>
							</Tab>

							<Tab label='Routes' id={'tabRoutes'}>
								{/* Simple Search Bar */}
								<TextField
									placeholder='Search Routes'
									type='search'
								/>

								{/* Current Favorites List */}
								<SelectionControlGroup
									className='listlayout'
									id='favorites-checkbox-2'
									name='favorites-2'
									type='checkbox'
									label='Favorite Routes'
									checkedCheckboxIcon={favorite}
									uncheckedCheckboxIcon={unfavorite}
									controls={this.state.favoriteRoutes.map((route: Route) => {
										return {label: route.name, value: route.id, checked: true, onChange: () => {
											// wait to play animation before moving
											setTimeout(() => {
												// remove from favorite list
												let routes = this.state.favoriteRoutes.slice(); // slice() performs shallow copy
												routes.splice(routes.indexOf(route), 1);
												this.setState({favoriteRoutes: routes});

												// add it to detected list
												routes = this.state.detectedRoutes.slice();
												routes.push(route);
												this.setState({detectedRoutes: routes});
											}, 250);
										}};
									})}
								/>

								{/* Nearby Routes List */}
								<SelectionControlGroup
									className='listlayout'
									id='nearby-checkbox-2'
									name='nearby-2'
									type='checkbox'
									label='Nearby Routes'
									checkedCheckboxIcon={favorite}
									uncheckedCheckboxIcon={unfavorite}
									controls={this.state.detectedRoutes.map((route: Route) => {
										return {label: route.name, value: route.id, checked: false, onChange: () => {
											// send to map. TODO: make this happen on radio button instead
											BusTrackerEvents.map.mapDisplayChangeRequested.dispatch({ID: route.id, type: SelectedObjectType.Route, polyString: route.polyline})

											// wait to play animation before moving
											setTimeout(() => {
												// remove from detected list
												let routes = this.state.detectedRoutes.slice(); // slice() performs shallow copy
												routes.splice(routes.indexOf(route), 1);
												this.setState({detectedRoutes: routes});

												// add it to favorite list
												routes = this.state.favoriteRoutes.slice();
												routes.push(route);
												this.setState({favoriteRoutes: routes});
											}, 250);
										}};
									})}
								/>

								{/*Add or Delete Routes*/}
								<CardText className="add-delete-button">Add or Delete Routes</CardText>
								<Button primary={true} raised={true}>+ Add New Route</Button>
								<Button primary={true} raised={true}>- Delete Route</Button>
							</Tab>

							{/* <Tab label='Buses' id='tabBuses'>
								
								<TextField
									placeholder='Search Buses'
									type='search'
								/>

								{/* Current Favorites List }
								<SelectionControlGroup
									className='listlayout'
									id='favorites-checkbox-3'
									name='favorites-3'
									type='checkbox'
									label='Favorite Buses'
									checkedCheckboxIcon={favorite}
									uncheckedCheckboxIcon={unfavorite}
									controls={this.state.detectedBusses.map((bus: Bus) => {
										return {label: bus.name, value: bus.id, checked: false, onChange: () => {
											// wait to play animation before moving
											setTimeout(() => {
												// remove from favorite list
												let busses = this.state.favoriteBusses.slice(); // slice() performs shallow copy
												busses.splice(busses.indexOf(bus), 1);
												this.setState({favoriteBusses: busses});

												// add it to detected list
												busses = this.state.detectedBusses.slice();
												busses.push(bus);
												this.setState({detectedBusses: busses});
											}, 250);
										}};
									})}
								/>

								{/* Nearby Buses List }
								<SelectionControlGroup
									className='listlayout'
									id='nearby-checkbox-3'
									name='nearby-3'
									type='checkbox'
									label='Nearby Buses'
									checkedCheckboxIcon={favorite}
									uncheckedCheckboxIcon={unfavorite}
									controls={this.state.detectedBusses.map((bus: Bus) => {
										return {label: bus.name, value: bus.id, checked: false, onChange: () => {
											// send to map. TODO: make this happen on radio button instead
											BusTrackerEvents.map.mapDisplayChangeRequested.dispatch({selectedObjectID: bus.id, selectedObjectType: SelectedObjectType.Bus})

											// wait to play animation before moving
											setTimeout(() => {
												// remove from detected list
												let busses = this.state.detectedBusses.slice(); // slice() performs shallow copy
												busses.splice(busses.indexOf(bus), 1);
												this.setState({detectedBusses: busses});

												// add it to favorite list
												busses = this.state.favoriteBusses.slice();
												busses.push(bus);
												this.setState({favoriteBusses: busses});
											}, 250);
										}};
									})}
								/>

								{/*Add or Delete Buses}
								<CardText className="add-delete-button">Add or Delete Buses</CardText>
								<Button primary={true} raised={true}>+ Add New Bus</Button>
								<Button primary={true} raised={true}>- Delete Bus</Button>
							</Tab> */}

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