import * as React from 'react';
import {TabsContainer, Tabs, Tab, TextField, Button} from 'react-md';

export class SideBar extends React.Component<any, any> {
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
								defaultValue='41.337716'
							/>
							<TextField
								label='Longitude A'
								defaultValue='-74.35912'
							/>
							<TextField
								label='Latitude B'
								defaultValue='40.7588528'
							/>
							<TextField
								label='Longitude B'
								defaultValue='-73.9852625'
							/>
							<Button flat>Get Directions</Button>
						</Tab>
						<Tab label='Targaryans'><h1>Fire and Blood</h1></Tab>
						<Tab label='Lannisters'><h1>A Lannister Always Pays His Debts</h1></Tab>
					</Tabs>
				</TabsContainer>
			</div>
		);
	}
}

export default SideBar;