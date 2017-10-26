import * as React from 'react';
import { TabsContainer, Tabs, Tab, TextField, Button } from 'react-md';
import * as GMapReact from 'google-map-react';
// API: https://react-md.mlaursen.com/components/

interface SideBarState {
	pointA: GMapReact.Coords;
	pointB: GMapReact.Coords;
}

interface SideBarProps {
	pointA: GMapReact.Coords;
	pointB: GMapReact.Coords;
	onMarkerPositionsChanged: (pointA: GMapReact.Coords, pointB: GMapReact.Coords) => void;
}

export default class SideBar extends React.Component<SideBarProps, SideBarState> {
	public constructor(props: SideBarProps) {
		super(props);
		this.state = {
			pointA: this.props.pointA,
			pointB: this.props.pointB,
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
								label="Latitude A"
								value={this.state.pointA.lat}
								onChange={(value) => {
									this.setState({pointA: {lat: Number(value), lng: this.state.pointA.lng}});
								}}
							/>
							<TextField
								label="Longitude A"
								value={this.state.pointA.lng}
								onChange={(value) => {
									this.setState({pointA: {lat: this.state.pointA.lat, lng: Number(value)}});
								}}
							/>
							<TextField
								label="Latitude B"
								value={this.state.pointB.lat}
								onChange={(value) => {
									this.setState({pointB: {lat: Number(value), lng: this.state.pointB.lng}});
								}}
							/>
							<TextField
								label="Longitude B"
								value={this.state.pointB.lng}
								onChange={(value) => {
									this.setState({pointB: {lat: this.state.pointB.lat, lng: Number(value)}});
								}}
							/>
							<Button
								flat={true}
								primary={true}
								onClick={() => {
									this.props.onMarkerPositionsChanged(this.state.pointA, this.state.pointB);
								}}
							>
							Get Directions
							</Button>
						</Tab>
						<Tab label="Targaryans"><h1>Fire and Blood</h1></Tab>
						<Tab label="Lannisters"><h1>A Lannister Always Pays His Debts</h1></Tab>
					</Tabs>
				</TabsContainer>
			</div>
		);
	}
}