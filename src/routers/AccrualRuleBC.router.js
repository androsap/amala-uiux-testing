import React from 'react';
import { Switch, Route } from 'react-router-dom';
import AccrualRuleBCIndex from '../pages/accrual_rule_bc/Index';
import AccrualRuleBCForm from '../pages/accrual_rule_bc/Form';
import Error404 from '../pages/error/Error404';

const Router = ({ match }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <AccrualRuleBCIndex menucode="ACCRLBC" prefixmenuname="ACCRLBC" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => <AccrualRuleBCForm menucode="ACCRLBC" prefixmenuname="ACCRLBC" {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => <AccrualRuleBCForm menucode="ACCRLBC" prefixmenuname="ACCRLBC" {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;