import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Index from '../pages/approval/corporate/travel_coordinator/Index';
import Form from '../pages/approval/corporate/travel_coordinator/Form';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <Index menucode="APPRCORP" prefixmenuname="APPRCORP" {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && (permission["APPRCORP"]["APPRCORP_ACCESS"] || permission["APPRCORP"]["APPRCORP_UPDATE"])) ? <Form menucode="APPRCORP" prefixmenuname="APPRCORP" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;
