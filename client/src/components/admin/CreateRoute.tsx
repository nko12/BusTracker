import * as React from 'react';
import { TextField, Divider, Button, Grid, Cell, List, ListItem } from 'react-md';
import { AdminViewProps } from './AdminTools';
import { appState } from '../../BusTrackerState';

interface CreateRouteState {
    positions: Array<Array<number>>
    currentLatitude: string,
    currentLongitude: string
    name: string,
    lastRouteId: string
}

export class CreateRoute extends React.Component<AdminViewProps, CreateRouteState> {

    public constructor(props: AdminViewProps) {
        super(props);
        this.state = {
            positions: new Array<Array<number>>(),
            currentLatitude: '',
            currentLongitude: '',
            name: '',
            lastRouteId: ''
        };
    }

    public render(): React.ReactNode {
        let idArea = null;
        if (this.state.lastRouteId != '') {
            idArea = (
                <div>
                    <Divider />
                    <span>New Route ID: {this.state.lastRouteId}</span>
                </div>
            )
        }
        return (
            <div style={{width: '60%', float: 'none', margin: '0 auto'}}>
                <Grid>
                    <Cell size={12}>
                        <TextField
                            id={'text-field-route-name'}
                            placeholder={'Route Name...'}
                            value={this.state.name}
                            onChange={(value: string) => { this.setState({ name: value }) }}
                        />                     
                        <br></br>
                        <br></br>
                    </Cell>
                </Grid>
                <Grid>
                    <Cell size={12}>
                    <span>Select coordinates in the list to remove them.</span>
                        <List>
                            {this.state.positions.map((coord: Array<number>, index: number) => {
                                return (
                                    <ListItem
                                        primaryText={coord[0] + ', ' + coord[1]}
                                        onClick={() => this.onItemSelected(index)}
                                    />)
                            })}
                        </List>
                    </Cell>
                </Grid>
                <Grid>
                    <Cell size={5} >
                        <TextField
                            id={'text-field-route-latitude'}
                            placeholder={'Next latitude'}
                            value={this.state.currentLatitude}
                            onChange={(value: string) => { this.setState({ currentLatitude: value }) }}
                        />
                    </Cell>
                    <Cell size={5}>
                        <TextField
                            id={'text-field-route-longitude'}
                            placeholder={'Next longitude'}
                            value={this.state.currentLongitude}
                            onChange={(value: string) => { this.setState({ currentLongitude: value }) }}
                        />
                    </Cell>
                    <Cell size={2}>
                        <Button flat onClick={this.onAddCoordinate}>Add Coordinate</Button>
                    </Cell>
                </Grid>
                <Grid>
                    <Cell size={12} offset={12}>
                        <Button primary flat onClick={async () => await this.onSubmitRoute()}>Create Route</Button>
                        {idArea}
                    </Cell>
                </Grid>
            </div>
        );
    }

    private onAddCoordinate = (): void => {

        const positions = this.state.positions.slice();
        positions.push([parseFloat(this.state.currentLatitude), parseFloat(this.state.currentLongitude)]);
        this.setState({ positions: positions, currentLatitude: '', currentLongitude: '' });
    }

    private onItemSelected = (itemIndex: number): void => {

        // Remove the item that was selected.
        const positions = this.state.positions.slice();
        positions.splice(itemIndex, 1);
        this.setState({ positions: positions });
    }

    private onSubmitRoute = async (): Promise<void> => {

        // Attempt to create a new route.
        const result = await appState.api.addNewRoute(appState.user.id, this.state.name, this.state.positions);
        if (result.success) {
            this.props.showToastCallback('Successfully created new route. ID: ' + result.data);
            this.setState({ positions: new Array<Array<number>>(), currentLatitude: '', currentLongitude: '', name: '', lastRouteId: result.data })
        } else {
            this.props.showToastCallback('Failed to create new route: ' + result.message);
        }
    }
}