import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { busTrackerRootReducer } from './state/BusTrackerState';
import * as WebFontLoader from 'webfontloader';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './styles/index.css';

WebFontLoader.load({
	google: {
		families: ['Roboto:300,400,500,700', 'Material Icons'],
	},
});

const store = createStore(busTrackerRootReducer);

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root') as HTMLElement
);
registerServiceWorker();