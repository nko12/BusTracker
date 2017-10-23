import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
	<App.App />,
	document.getElementById('root') as HTMLElement
);
registerServiceWorker();