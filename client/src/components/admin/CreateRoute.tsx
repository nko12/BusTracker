import * as React from 'react';
import { TextField, Divider, Button, Grid, Cell } from 'react-md';
import { AdminViewProps } from './AdminTools';
import { appState } from '../../BusTrackerState';

interface CreateRouteState {
    positionText: string,
    name: string,
    lastRouteId: string
}

export class CreateRoute extends React.Component<AdminViewProps, CreateRouteState> {

    public constructor(props: AdminViewProps) {
        super(props);
        this.state = {
            positionText: '',
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
                    <span>Specify the coordinates that make up the route as latitude, longitude pairs. Each pair should be on a separate line.</span>
                    </Cell>
                </Grid>
                <Grid>
                    <TextField
                        id='text-field-lat-lngs'
                        placeholder='Enter Latitude, Longitude pairs.'
                        value={this.state.positionText}
                        rows={10}
                        onChange={(value: string) => { this.setState({positionText: value})}}
                    />
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

    private onSubmitRoute = async (): Promise<void> => {

        // Take the contents of the route definition textbox and split it along each new long to get each string latitude/longitude pair.
        // For each of these pairs, split them on the comma to get an array [latitude, longitude]
        const latLngs: Array<Array<number>> = this.state.positionText.replace(/\n/g, ' ').split(' ').map((strPosition: string) => {
            
            return strPosition.split(',').map((latlng: string) => {
                return parseFloat(latlng);
            });
        });

        // Attempt to create a new route.
        const result = await appState.api.addNewRoute(appState.user.id, this.state.name, latLngs);
        if (result.success) {
            this.props.showToastCallback('Successfully created new route. ID: ' + result.data);
            this.setState({ positionText: '', name: '', lastRouteId: result.data })
        } else {
            this.props.showToastCallback('Failed to create new route: ' + result.message);
        }
    }
}