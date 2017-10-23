import * as React from 'react';
import {Tabs, Tab} from 'react-md';
// import * as ReactMD from 'react-md';

export class SideBar extends React.Component<any, any> {
	render() {
		return (
			// <ReactMD.TextField
			// 	placeholder='wawawewa'
			// 	type='text'
			// 	helpText='green is not a creative colour'
			// 	// helpOnFocus='true'
			// 	defaultValue='40.7128' // -74.0060
			// >
			// </ReactMD.TextField>
			<div>
				<Tabs
					activeTab={2}
					tabId={1}
				>
					<Tab>Starks</Tab>
					<Tab>Lannisters</Tab>
					<Tab>Targaryens</Tab>
				</Tabs>
				<section>
					<div>Content for this tab: TODO </div>
				</section>
			</div>
		);
	}
}

export default SideBar;