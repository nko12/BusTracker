import * as React from 'react';
import {TabsContainer, Tabs, Tab, TextField, Button} from 'react-md';
// API: https://react-md.mlaursen.com/components/

export default class SideBar extends React.Component<any, any> {
	state = {
		pointA: this.props.pointA,
		pointB: this.props.pointB,
	};

	render() {
		return (
			<div>
				<TabsContainer
					className='tabs__page-layout'
					panelClassName='md-grid'
				>
					<Tabs tabId='phone-stuffs'>
						<Tab label='Starks'>
							<h1>Winter is Coming</h1>
							<TextField
								label='Latitude A'
								value={this.state.pointA.lat}
								onChange={(value) => {
									this.setState({pointA: {lat: Number(value), lng: this.state.pointA.lng}});
								}}
							/>
							<TextField
								label='Longitude A'
								value={this.state.pointA.lng}
								onChange={(value) => {
									this.setState({pointA: {lat: this.state.pointA.lat, lng: Number(value)}});
								}}
							/>
							<TextField
								label='Latitude B'
								value={this.state.pointB.lat}
								onChange={(value) => {
									this.setState({pointB: {lat: Number(value), lng: this.state.pointB.lng}});
								}}
							/>
							<TextField
								label='Longitude B'
								value={this.state.pointB.lng}
								onChange={(value) => {
									this.setState({pointB: {lat: this.state.pointB.lat, lng: Number(value)}});
								}}
							/>
							<Button
							flat
							primary
							onClick={() => {
								this.props.sendToApp(this.state.pointA, this.state.pointB);
							}}
						>
							Get Directions
						</Button>
						</Tab>
						<Tab label='Targaryans'><h1>Fire and Blood</h1></Tab>
						<Tab label='Lannisters'><h1>A Lannister Always Pays His Debts</h1></Tab>
					</Tabs>
				</TabsContainer>
			</div>
		);
	}
}