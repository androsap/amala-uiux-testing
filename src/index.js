import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from "react-redux";
import configureStore from "./utilities/store/Store";
import App from './App';
import registerServiceWorker from './registerServiceWorker';

render((
	<Provider store={configureStore}>
		<BrowserRouter basename="/">
			<App />
		</BrowserRouter>
	</Provider>
), document.getElementById('root'));

registerServiceWorker();