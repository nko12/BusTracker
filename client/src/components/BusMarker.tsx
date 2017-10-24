import * as React from 'react';

export default class BusMarker extends React.Component<any, any> {
	render() {
		return (
			<div className='busMarker'>
				{this.props.text}
			</div>
		);
	}
}