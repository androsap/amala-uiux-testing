import React from 'react';
import { Switch, Route } from 'react-router-dom';
import StateIndex from '../pages/state/Index';
import StateForm from '../pages/state/Form';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <StateIndex menucode="MSDTSTATE" prefixmenuname="STATE" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => (permission !== undefined && permission["MSDTSTATE"]["STATE_CREATE"]) ? <StateForm menucode="MSDTSTATE" prefixmenuname="STATE" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && (permission["MSDTSTATE"]["STATE_ACCESS"] || permission["MSDTSTATE"]["STATE_UPDATE"])) ? <StateForm menucode="MSDTSTATE" prefixmenuname="STATE" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;