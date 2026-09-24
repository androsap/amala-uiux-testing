import React from 'react';
import { Switch, Route } from 'react-router-dom';
import CommunicationIndex from '../pages/communication/Index';
import CommunicationForm from '../pages/communication/Form';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <CommunicationIndex menucode="NEWS" prefixmenuname="NEWS" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => (permission !== undefined && permission["NEWS"]["NEWS_CREATE"]) ? <CommunicationForm menucode="NEWS" prefixmenuname="NEWS" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && (permission["NEWS"]["NEWS_ACCESS"] || permission["NEWS"]["NEWS_UPDATE"])) ? <CommunicationForm menucode="NEWS" prefixmenuname="NEWS" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;