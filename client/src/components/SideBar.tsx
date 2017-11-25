import * as React from 'react';
import {BusTrackerEvents} from '../BusTrackerEvents';
import {appState} from '../BusTrackerState';
import {Stop} from '../models/Stop';
import {Route} from '../models/Route';
import {CardText, TabsContainer, Tabs, Tab, TextField, Button, FontIcon, SelectionControlGroup} from 'react-md';

const bus = <FontIcon>star</FontIcon>;

export interface SideBarState {
	favoriteStops: Array<Stop>;
	favoriteRoutes: Array<Route>;
	detectedStops: Array<Stop>;
	detectedRoutes: Array<Route>;
	selectedTabId: string;
}

export interface SideBarProps {}

export class SideBar extends React.Component<SideBarProps, SideBarState> {
	public constructor(props: SideBarProps) {
		super(props);
		this.state = {
			favoriteStops: new Array<Stop>(),
			favoriteRoutes: new Array<Route>(),
			detectedStops: new Array<Stop>(),
			detectedRoutes: new Array<Route>(),
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

								{/*Simple Search Bar*/}
								<TextField
									placeholder='Search Stops'
									type='search'
								/>

								{/*Current Favorites List*/}
								<SelectionControlGroup
									className='listlayout'
									id='favorites-checkbox'
									name='favorites'
									type='checkbox'
									label='Favorites'
									defaultValue='A,B,C'
									checkedCheckboxIcon={bus}
									controls={this.state.favoriteStops.map((stop: Stop) => {
										return { label: stop.name, value: stop.id };
									})}
								/>
								{/* Nearby Stops List*/}
								<SelectionControlGroup
									className='listlayout'
									id='nearby-checkbox'
									name='nearby'
									type='checkbox'
									label='Nearby Stops'
									checkedCheckboxIcon={bus}
									controls={this.state.detectedStops.map((stop: Stop) => {
										return {label: stop.name, value: stop.id};
									})}
								/>

								<CardText />
							</Tab>

							<Tab label='Routes' id={'tabRoutes'}>
								<h3>Bus Routes</h3>

								{/*Simple Search Bar*/}
								<TextField
									placeholder='Search Routes'
									type='search'
								/>

								{/*Current Favorites List*/}
								<SelectionControlGroup
									className='listlayout'
									id='favorites-checkbox-2'
									name='favorites-2'
									type='checkbox'
									label='Favorite Routes'
									defaultValue='a,b,c'
									checkedCheckboxIcon={bus}
									controls={this.state.favoriteRoutes.map((route: Route) => {
										return { label: route.name, value: route.id };
									})}
								/>

								{/* Nearby Routes List*/}
								<SelectionControlGroup
									className='listlayout'
									id='nearby-checkbox-2'
									name='nearby-2'
									type='checkbox'
									label='Nearby Routes'
									checkedCheckboxIcon={bus}
									controls={this.state.detectedRoutes.map((route: Route) => {
										return { label: route.name, value: route.id };
									})}
								/>
							</Tab>

							<Tab label='Buses' id='tabBuses'>
								<h3>Busses</h3>

								{/*Simple Search Bar*/}
								<TextField
									placeholder='Search Buses'
									type='search'
								/>

								{/*Current Favorites List*/}
								<SelectionControlGroup
									className='listlayout'
									id='favorites-checkbox-3'
									name='favorites-3'
									type='checkbox'
									label='Favorite Buses'
									defaultValue='AAA,BBB,CCC'
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
									className='listlayout'
									id='nearby-checkbox-3'
									name='nearby-3'
									type='checkbox'
									label='Nearby Buses'
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