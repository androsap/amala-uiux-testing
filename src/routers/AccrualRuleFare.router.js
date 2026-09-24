import React from 'react';
import { Switch, Route } from 'react-router-dom';
import AccrualRuleFareIndex from '../pages/accrual_rule_fare_family/Index';
import AccrualRuleFareForm from '../pages/accrual_rule_fare_family/Form';
import Error404 from '../pages/error/Error404';

const Router = ({ match }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <AccrualRuleFareIndex menucode="ACCRLFF" prefixmenuname="ACCRLFF" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => <AccrualRuleFareForm menucode="ACCRLFF" prefixmenuname="ACCRLFF" {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => <AccrualRuleFareForm menucode="ACCRLFF" prefixmenuname="ACCRLFF" {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;