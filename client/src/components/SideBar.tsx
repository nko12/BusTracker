import * as React from 'react';
import {
	CardText, TabsContainer, Tabs, Tab, Button, FontIcon,
	SelectionControl, Checkbox, List, ListItem, ListItemControl, Divider, Card
} from 'react-md';
import Scrollbar from 'react-custom-scrollbars';
import { BusTrackerEvents, SelectedObjectType } from '../BusTrackerEvents';
import { appState } from '../BusTrackerState';
import { Stop } from '../models/Stop';
import { Route } from '../models/Route';

const favorite = <FontIcon>star</FontIcon>;
const unfavorite = <FontIcon>star_border</FontIcon>;

export interface SideBarState {
	// detectedBusses: Bus[];
	// favoriteBusses: Bus[];

	detectedStops: Stop[];
	favoriteStops: Stop[];

	detectedRoutes: Route[];
	selectedTabId: string;
	editFavoriteMode: boolean;
	favoriteRoutes: Route[];
}

export interface SideBarProps { }

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

			selectedTabId: 'tabStops',
			editFavoriteMode: false
		};

		this.onLogin = this.onLogin.bind(this);
		this.toggleFavoriteStop = this.toggleFavoriteStop.bind(this);

		BusTrackerEvents.login.loginSucceeded.add(this.onLogin);
	}

	private async onLogin(): Promise<void> {

		// Get the list of stops that are nearby.
		const stopResult = await appState.api.getStopsNearLocation(appState.location);
		if (!stopResult.success) { }

		// Get the list of stops that the user has favorited, and request them from the server.
		const favoriteStopResult = await appState.api.getStops(appState.user.favoriteStopIds);
		if (!favoriteStopResult.success) { }

		// Get the list of routes that are nearby.
		const routeResult = await appState.api.getRoutesNearLocation(appState.location);
		if (!routeResult.success) { }

		// Get the list of routes that the user has favorited, and request them from the server.
		const favoriteRouteResult = await appState.api.getRoutes(appState.user.favoriteRouteIds);
		if (!favoriteRouteResult.success) { }

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

	private async toggleFavoriteStop(stop: Stop, makeFavorite: boolean): Promise<void> {

		if (makeFavorite) {

			// First, request the server change the user's favorite list.
			const favoriteList: Array<string> = appState.user.favoriteStopIds.slice();
			favoriteList.push(stop.id);
			const result = await appState.api.editFavoriteStopIDs(appState.user.id, favoriteList);
			if (!result.success) {
				alert('Failed to modify favorites: ' + result.message);
				return;
			}

			// Favorites modified on server, update the user object.
			appState.user.favoriteStopIds = favoriteList;

			// Modify the list to add this favorite.
			setTimeout(() => {

				// remove stop from detected list
				let stops = this.state.detectedStops.slice(); // slice() performs shallow copy
				stops.splice(stops.indexOf(stop), 1);
				this.setState({ detectedStops: stops });

				// add it to favorites list
				stops = this.state.favoriteStops.slice();
				stops.push(stop);
				this.setState({ favoriteStops: stops });
			}, 250);
		} else {

			// First, request the server change the user's favorites by removing this favorite.
			const favoriteList: Array<string> = appState.user.favoriteStopIds.slice();
			favoriteList.splice(favoriteList.indexOf(stop.id), 1);
			const result = await appState.api.editFavoriteStopIDs(appState.user.id, favoriteList);
			if (!result.success) {
				alert('Failed to modify favorites: ' + result.message);
				return;
			}

			// Favorites modified on server, update the user object.
			appState.user.favoriteStopIds = favoriteList;

			// Modify the list to remove the favorite.
			setTimeout(() => {
				// remove stop from favorite list
				let stops = this.state.favoriteStops.slice(); // slice() performs shallow copy
				stops.splice(stops.indexOf(stop), 1);
				this.setState({ favoriteStops: stops });

				// add it to detected list
				stops = this.state.detectedStops.slice();
				stops.push(stop);
				this.setState({ detectedStops: stops });
			}, 250);
		}
	}

	private async toggleFavoriteRoute(route: Route, makeFavorite: boolean): Promise<void> {

		if (makeFavorite) {

			// First, request the server change the user's favorite list.
			const favoriteList: Array<string> = appState.user.favoriteRouteIds.slice();
			favoriteList.push(route.id);
			const result = await appState.api.editFavoriteRouteIDs(appState.user.id, favoriteList);
			if (!result.success) {
				alert('Failed to modify favorites: ' + result.message);
				return;
			}

			// Favorites modified on server, update the user object.
			appState.user.favoriteRouteIds = favoriteList;

			// Modify the list to add this favorite.
			setTimeout(() => {

				// remove route from detected list
				let routes = this.state.detectedRoutes.slice(); // slice() performs shallow copy
				routes.splice(routes.indexOf(route), 1);
				this.setState({ detectedRoutes: routes });

				// add it to favorites list
				routes = this.state.favoriteRoutes.slice();
				routes.push(route);
				this.setState({ favoriteRoutes: routes });
			}, 250);
		} else {

			// First, request the server change the user's favorites by removing this favorite.
			const favoriteList: Array<string> = appState.user.favoriteRouteIds.slice();
			favoriteList.splice(favoriteList.indexOf(route.id), 1);
			const result = await appState.api.editFavoriteRouteIDs(appState.user.id, favoriteList);
			if (!result.success) {
				alert('Failed to modify favorites: ' + result.message);
				return;
			}

			// Favorites modified on server, update the user object.
			appState.user.favoriteRouteIds = favoriteList;

			// Modify the list to remove the favorite.
			setTimeout(() => {
				// remove stop from favorite list
				let routes = this.state.favoriteRoutes.slice(); // slice() performs shallow copy
				routes.splice(routes.indexOf(route), 1);
				this.setState({ favoriteRoutes: routes });

				// add it to detected list
				routes = this.state.detectedRoutes.slice();
				routes.push(route);
				this.setState({ detectedRoutes: routes });
			}, 250);
		}
	}

	render() {
		return (
			<div style={{ overflow: 'auto' }}>
				<TabsContainer
					className='tabs__page-layout'
					panelClassName='md-grid'
				>
					<Tabs tabId='phone-stuffs'>
						<Tab label='Stops' id={'tabStops'}>
							<h3>Bus Stops</h3>

							<Checkbox
								id={'checkboxEditFavoriteStopMode'}
								name={'checkboxEditFavoriteStopMode'}
								checked={this.state.editFavoriteMode}
								onChange={() => this.setState({ editFavoriteMode: !this.state.editFavoriteMode })}
								label={this.state.editFavoriteMode ? 'Exit Favorite Mode' : 'Enter Favorite Mode'}
							/>

							<Scrollbar style={{ height: '550px' }}>
								<h3>Favorites</h3>
								<List>
									{this.state.favoriteStops.map((stop: Stop) => {
										if (this.state.editFavoriteMode) {
											return (
												<ListItemControl
													secondaryAction={
														<SelectionControl
															id={stop.id + '_FAV'}
															name={stop.id + '_STOP_FAV'}
															type='checkbox'
															checkedCheckboxIcon={favorite}
															uncheckedCheckboxIcon={unfavorite}
															checked={true} // Anything in favorites is checked.
															label={stop.name}
															labelBefore
															onChange={() => this.toggleFavoriteStop(stop, false)}
														/>
													}
												/>
											);
										} else {
											return (
												<ListItem
													primaryText={stop.name}
													onClick={() => {
														BusTrackerEvents.map.mapDisplayChangeRequested.dispatch(
															{ ID: stop.id, type: SelectedObjectType.Stop, location: { lat: stop.latitude, lng: stop.longitude } }
														);
													}}
												/>
											)
										}
									})}
								</List>

								{/* Divide the favorites from everything else. */}
								<Divider></Divider>
								<h3>Nearby</h3>

								<List>
									{this.state.detectedStops.map((stop: Stop) => {
										if (this.state.editFavoriteMode) {
											return (
												<ListItemControl
													secondaryAction={
														<SelectionControl
															id={stop.id}
															name={stop.id + '_STOP'}
															type='checkbox'
															checkedCheckboxIcon={favorite}
															uncheckedCheckboxIcon={unfavorite}
															checked={false}
															label={stop.name}
															labelBefore
															onChange={() => this.toggleFavoriteStop(stop, true)}
														/>
													}
												/>
											);
										} else {
											return (
												<ListItem
													primaryText={stop.name}
													onClick={() => {
														BusTrackerEvents.map.mapDisplayChangeRequested.dispatch(
															{ ID: stop.id, type: SelectedObjectType.Stop, location: { lat: stop.latitude, lng: stop.longitude } }
														);
													}}
												/>
											)
										}
									})}
								</List>
							</Scrollbar>

							{/*Add or Delete Stops*/}
							<Card>
								<CardText className="add-delete-button">Add or Delete Stops</CardText>
								<Button primary={true} raised={true}>+ Add New Stop</Button>
								<Button primary={true} raised={true}>- Delete Stop</Button>
							</Card>
						</Tab>

						<Tab label='Routes' id={'tabRoutes'}>
							<h3>Bus Routes</h3>

							<Checkbox
								id={'checkboxEditFavoriteRouteMode'}
								name={'checkboxEditFavoriteRouteMode'}
								checked={this.state.editFavoriteMode}
								onChange={() => this.setState({ editFavoriteMode: !this.state.editFavoriteMode })}
								label={this.state.editFavoriteMode ? 'Exit Favorite Mode' : 'Enter Favorite Mode'}
							/>

							<Scrollbar style={{ height: '550px' }}>
								<h3>Favorites</h3>
								<List>
									{this.state.favoriteRoutes.map((route: Route) => {
										if (this.state.editFavoriteMode) {
											return (
												<ListItemControl
													secondaryAction={
														<SelectionControl
															id={route.id + '_FAV'}
															name={route.id + '_ROUTE_FAV'}
															type='checkbox'
															checkedCheckboxIcon={favorite}
															uncheckedCheckboxIcon={unfavorite}
															checked={true} // Anything in favorites is checked.
															label={route.name}
															labelBefore
															onChange={() => this.toggleFavoriteRoute(route, false)}
														/>
													}
												/>
											);
										} else {
											return (
												<ListItem
													primaryText={route.name}
													onClick={() => {
														BusTrackerEvents.map.mapDisplayChangeRequested.dispatch(
															{ ID: route.id, type: SelectedObjectType.Route, polyString: route.polyline }
														);
													}}
												/>
											)
										}
									})}
								</List>

								{/* Divide the favorites from everything else. */}
								<Divider></Divider>
								<h3>Nearby</h3>

								<List>
									{this.state.detectedRoutes.map((route: Route) => {
										if (this.state.editFavoriteMode) {
											return (
												<ListItemControl
													secondaryAction={
														<SelectionControl
															id={route.id}
															name={route.id + '_ROUTE'}
															type='checkbox'
															checkedCheckboxIcon={favorite}
															uncheckedCheckboxIcon={unfavorite}
															checked={false}
															label={route.name}
															labelBefore
															onChange={() => this.toggleFavoriteRoute(route, true)}
														/>
													}
												/>
											);
										} else {
											return (
												<ListItem
													primaryText={route.name}
													onClick={() => {
														BusTrackerEvents.map.mapDisplayChangeRequested.dispatch(
															{ ID: route.id, type: SelectedObjectType.Route, polyString: route.polyline }
														);
													}}
												/>
											)
										}
									})}
								</List>
							</Scrollbar>

							{/*Add or Delete Routes*/}
							<Card>
								<CardText className="add-delete-button">Add or Delete Routes</CardText>
								<Button primary={true} raised={true}>+ Add New Route</Button>
								<Button primary={true} raised={true}>- Delete Route</Button>
							</Card>

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