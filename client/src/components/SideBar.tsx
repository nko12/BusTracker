import * as React from 'react';
import {TabsContainer, Tabs, Tab, TextField, Button} from 'react-md';

export default class SideBar extends React.Component<any, any> {
	state = {
		latA: this.props.pointA.lat,
		lngA: this.props.pointA.lng,
		latB: this.props.pointB.lat,
		lngB: this.props.pointB.lng,
	}

	handleLatAchange = (latA: any) => {
		this.setState({latA});
		this.props.callBackFunction({lat: this.state.latA, lng: this.state.lngA}, {lat: this.state.latB, lng: this.state.lngB});
	}

	handleLngAchange = (lngA: any) => {
		this.setState({lngA});
		this.props.callBackFunction({lat: this.state.latA, lng: this.state.lngA}, {lat: this.state.latB, lng: this.state.lngB});
	}

	handleLatBchange = (latB: any) => {
		this.setState({latB});
		this.props.callBackFunction({lat: this.state.latA, lng: this.state.lngA}, {lat: this.state.latB, lng: this.state.lngB});
	}

	handleLngBchange = (lngB: any) => {
		this.setState({lngB});
		this.props.callBackFunction({lat: this.state.latA, lng: this.state.lngA}, {lat: this.state.latB, lng: this.state.lngB});
	}

	render() {
		var {latA, lngA, latB, lngB} = this.state;

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
								value={latA}
								onChange={this.handleLatAchange}
							/>
							<TextField
								label='Longitude A'
								value={lngA}
								onChange={this.handleLngAchange}
							/>
							<TextField
								label='Latitude B'
								value={latB}
								onChange={this.handleLatBchange}
							/>
							<TextField
								label='Longitude B'
								value={lngB}
								onChange={this.handleLngBchange}
							/>
							<Button flat primary>Get Directions</Button>
						</Tab>
						<Tab label='Targaryans'><h1>Fire and Blood</h1></Tab>
						<Tab label='Lannisters'><h1>A Lannister Always Pays His Debts</h1></Tab>
					</Tabs>
				</TabsContainer>
			</div>
		);
	}
}