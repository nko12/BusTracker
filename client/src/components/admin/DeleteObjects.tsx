import * as React from 'react';
import { List, ListItem, Grid, Cell } from 'react-md';
import { appState } from '../../BusTrackerState';
import { AdminViewProps } from './AdminTools';
import { Route } from '../../models/Route';
import { Stop } from '../../models/Stop';

interface DeleteObjectState {
    routes: Array<Route>;
    stops: Array<Stop>;
}

export class DeleteObjects extends React.Component<AdminViewProps, DeleteObjectState> {

    public constructor(props: AdminViewProps) {
        super(props);
        this.state = {
            routes: new Array<Route>(),
            stops: new Array<Stop>()
        }
    }

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

    public render(): React.ReactNode {

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

    private deleteStopRequested = async (stop: Stop): Promise<void> => {

        const result = await appState.api.removeStop(appState.user.id, stop.id);
        if (result.success) {
            this.props.showToastCallback('Bus stop successfully removed.');
            const stops = this.state.stops;
            stops.splice(stops.indexOf(stop), 1);
            this.setState({ stops: stops });
        } else {
            this.props.showToastCallback('Failed to delete the bus stop: ' + result.message);
        }
    }

    private deleteRouteRequested = async (route: Route): Promise<void> => {

        const result = await appState.api.removeRoute(appState.user.id, route.id);
        if (result.success) {
            this.props.showToastCallback('Bus stop successfully removed.');
            const routes = this.state.routes;
            routes.splice(routes.indexOf(route), 1);
            this.setState({ routes: routes });
        } else {
            this.props.showToastCallback('Failed to delete the route: ' + result.message);
        }
    }
}