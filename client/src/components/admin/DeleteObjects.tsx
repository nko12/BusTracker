import * as React from 'react';
import { List, ListItem, Grid, Cell } from 'react-md';
import { appState } from '../../BusTrackerState';
import { AdminViewProps } from './AdminTools';
import { Route } from '../../models/Route';
import { Stop } from '../../models/Stop';

/**
 * Interface for the state variables that the DeleteObjects component needs to use.
 */
interface DeleteObjectState {
	routes: Array<Route>;
	stops: Array<Stop>;
}

/**
 * Represents the contents of the Delete Objects tab in the AdminTools window. This allows
 * admin to delete either fake bus stops or fake routes that they have created.
 */
export class DeleteObjects extends React.Component<AdminViewProps, DeleteObjectState> {

	public constructor(props: AdminViewProps) {
		super(props);
		this.state = {
			routes: new Array<Route>(),
			stops: new Array<Stop>()
		}
	}

	/**
	 * Reloads the list of fake stops and fake routes.
	 */
	public reloadFakeObjects = async (): Promise<void> => {
		let stopResult = await appState.api.getFakeStops();
		if (!stopResult.success) {
			this.props.showToastCallback('Failed to get the list of fake stops: ' + stopResult.message);
			return;
		}

		let routeResult = await appState.api.getFakeRoutes();
		if (!routeResult.success) {
			this.props.showToastCallback('Failed to get the list of fake routes: ' + routeResult.message);
			return;
		}

		this.setState({stops: stopResult.data, routes: routeResult.data});
	}

	public render() {

		return (
			<div style={{float: 'none', margin: '0 auto', width: '60%'}}>
				<Grid>
					<Cell size={6}>
						<span>Select bus stop names below to delete them.</span>
						<br></br>
						<br></br>
						<List>
							{this.state.stops.map((stop: Stop) => {
								return (
									<ListItem
										primaryText={stop.name}
										onClick={() => this.deleteStopRequested(stop)}
									/>
								);
							})}
						</List>
					</Cell>
					<Cell size={6}>
						<span>Select route names below to delete them.</span>
						<br></br>
						<br></br>
						<List>
							{this.state.routes.map((route: Route) => {
								return (
									<ListItem
									primaryText={route.name}
									onClick={() => this.deleteRouteRequested(route)}
								/>
								);
							})} 
						</List>
					</Cell>
				</Grid>
			</div>
		);
	}

	/**
	 * Called when one of the fake stops have been clicked in the listview. Attempts to
	 * delete the fake stop.
	 */
	private deleteStopRequested = async (stop: Stop): Promise<void> => {

		// Attempt to delete the fake stop.
		const result = await appState.api.removeStop(appState.user.id, stop.id);
		if (result.success) {
			this.props.showToastCallback('Bus stop successfully removed.');
			const stops = this.state.stops.slice();
			stops.splice(stops.indexOf(stop), 1);
			this.setState({ stops: stops });
		} else {
			this.props.showToastCallback('Failed to delete the bus stop: ' + result.message);
		}
	}

	/**
	 * Called when one of the fake routes have been clicked in the listview. Attempts to
	 * delete the fake route.
	 */
	private deleteRouteRequested = async (route: Route): Promise<void> => {

		// Attempt to delete the fake route.
		const result = await appState.api.removeRoute(appState.user.id, route.id);
		if (result.success) {
			this.props.showToastCallback('Bus stop successfully removed.');
			const routes = this.state.routes.slice();
			routes.splice(routes.indexOf(route), 1);
			this.setState({ routes: routes });
		} else {
			this.props.showToastCallback('Failed to delete the route: ' + result.message);
		}
	}
}