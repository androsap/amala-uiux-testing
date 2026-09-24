import React from 'react';
import { Switch, Route } from 'react-router-dom';
import NonAirIndex from '../pages/accrual_rule_nonair/Index';
import NonAirForm from '../pages/accrual_rule_nonair/Form';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <NonAirIndex menucode="ACCRLNA" prefixmenuname="ACCRLNA" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => (permission !== undefined && permission["ACCRLNA"]["ACCRLNA_CREATE"]) ? <NonAirForm menucode="ACCRLNA" prefixmenuname="ACCRLNA" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && (permission["ACCRLNA"]["ACCRLNA_ACCESS"] || permission["ACCRLNA"]["ACCRLNA_UPDATE"])) ? <NonAirForm menucode="ACCRLNA" prefixmenuname="ACCRLNA" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;