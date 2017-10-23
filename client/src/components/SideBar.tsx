import * as React from 'react';
import * as ReactMD from 'react-md';

export class SideBar extends React.Component {
	render() {
		return (
			<ReactMD.TextField
				placeholder='wawawewa'
				type='text'
				helpText='this is fun'
				// helpOnFocus='true'
				defaultValue='40.7128' // -74.0060
			>
			</ReactMD.TextField>
		);
	}
}

export default SideBar;