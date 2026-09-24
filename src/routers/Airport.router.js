import React from 'react';
import { Switch, Route } from 'react-router-dom';
import AirportIndex from '../pages/airport/Index';
import AirportForm from '../pages/airport/Form';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <AirportIndex menucode="MSDTAIRPORT" prefixmenuname="AIRPORT" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => (permission !== undefined && permission["MSDTAIRPORT"]["AIRPORT_CREATE"]) ? <AirportForm menucode="MSDTAIRPORT" prefixmenuname="AIRPORT" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && (permission["MSDTAIRPORT"]["AIRPORT_ACCESS"] || permission["MSDTAIRPORT"]["AIRPORT_UPDATE"])) ? <AirportForm menucode="MSDTAIRPORT" prefixmenuname="AIRPORT" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;