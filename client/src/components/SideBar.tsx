import * as React from 'react';
import {CardText, TabsContainer, Tabs, Tab, TextField, Button, FontIcon, SelectionControlGroup} from 'react-md';
import {BusTrackerEvents, SelectedObjectType} from '../BusTrackerEvents';
import {appState} from '../BusTrackerState';
import {Stop} from '../models/Stop';
import {Route} from '../models/Route';

const favorite = <FontIcon>star</FontIcon>;
const unfavorite = <FontIcon>star_border</FontIcon>;

export interface SideBarState {
	favoriteStops: Stop[];
	favoriteRoutes: Route[];
	detectedStops: Stop[];
	detectedRoutes: Route[];
	selectedTabId: string;
}

export interface SideBarProps {}

export class SideBar extends React.Component<SideBarProps, SideBarState> {
	public constructor(props: SideBarProps) {
		super(props);
		this.state = {
			favoriteStops: [] as Stop[],
			favoriteRoutes: [] as Route[],
			detectedStops: [] as Stop[],
			detectedRoutes: [] as Route[],
			selectedTabId: 'tabStops'
		};

		this.onLogin = this.onLogin.bind(this);
	}

	public componentDidMount(): void {
		BusTrackerEvents.login.loginSucceeded.add(this.onLogin);
	}

	private async onLogin(): Promise<void> {
		// Get the list of bus stops that are nearby.
		const stopResult = await appState.api.getStopsNearLocation({lat: 40.7588528, lng: -73.9852625});
		if (!stopResult.success) {}

		// Get the list of bus stops that the user has favorited, and request them from the server.
		const favoriteStopResult = await appState.api.getStops(appState.user.favoriteStopIds);
		if (!favoriteStopResult.success) {}

		// Get the list of routes that are nearby.
		const routeResult = await appState.api.getRoutesNearLocation({lat: 40.7588528, lng: -73.9852625});
		if (!routeResult.success) {}

		// Get the list of routes that the user has favorited, and request them from the server.
		const favoriteRouteResult = await appState.api.getRoutes(appState.user.favoriteStopIds);
		if (!favoriteRouteResult.success) {}

		// TODO: Remove duplicates between what is nearby and what the user has favorited.
		this.setState({
			favoriteStops: favoriteStopResult.data,
			detectedStops: stopResult.data,
			favoriteRoutes: favoriteRouteResult.data,
			detectedRoutes: routeResult.data
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
								<h3>Bus Stops</h3>

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
												// remove stop from favorite list
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
											{/*console.log(JSON.stringify(stop));*/}

											BusTrackerEvents.map.mapDisplayChangeRequested.dispatch({selectedObjectID: stop.id, selectedObjectType: SelectedObjectType.Stop})

											// wait to play animation before moving
											setTimeout(() => {
												// remove stop from detected list
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
								<h3>Bus Routes</h3>

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
										return { label: route.name, value: route.id };
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
										return { label: route.name, value: route.id };
									})}
								/>

								{/*Add or Delete Routes*/}
								<CardText className="add-delete-button">Add or Delete Routes</CardText>
								<Button primary={true} raised={true}>+ Add New Route</Button>
								<Button primary={true} raised={true}>- Delete Route</Button>
							</Tab>

							<Tab label='Buses' id='tabBuses'>
								<h3>Busses</h3>

								{/* Simple Search Bar */}
								<TextField
									placeholder='Search Buses'
									type='search'
								/>

								{/* Current Favorites List */}
								<SelectionControlGroup
									className='listlayout'
									id='favorites-checkbox-3'
									name='favorites-3'
									type='checkbox'
									label='Favorite Buses'
									checkedCheckboxIcon={favorite}
									uncheckedCheckboxIcon={unfavorite}
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

								{/* Nearby Buses List */}
								<SelectionControlGroup
									className='listlayout'
									id='nearby-checkbox-3'
									name='nearby-3'
									type='checkbox'
									label='Nearby Buses'
									checkedCheckboxIcon={favorite}
									uncheckedCheckboxIcon={unfavorite}
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

								{/*Add or Delete Buses*/}
								<CardText className="add-delete-button">Add or Delete Buses</CardText>
								<Button primary={true} raised={true}>+ Add New Bus</Button>
								<Button primary={true} raised={true}>- Delete Bus</Button>
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