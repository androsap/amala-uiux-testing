import React from 'react';
import { Switch, Route } from 'react-router-dom';
import AccrualRuleODIndex from '../pages/accrual_rule_od/Index';
import AccrualRuleODForm from '../pages/accrual_rule_od/Form';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <AccrualRuleODIndex menucode="ACCRLOD" prefixmenuname="ACCRLOD" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => (permission !== undefined && permission["ACCRLOD"]["ACCRLOD_CREATE"]) ? <AccrualRuleODForm menucode="ACCRLOD" prefixmenuname="ACCRLOD" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && (permission["ACCRLOD"]["ACCRLOD_ACCESS"] || permission["ACCRLOD"]["ACCRLOD_UPDATE"])) ? <AccrualRuleODForm menucode="ACCRLOD" prefixmenuname="ACCRLOD" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;