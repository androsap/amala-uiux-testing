import React from 'react';
import { Switch, Route } from 'react-router-dom';
import AccrualRuleIndex from '../pages/accrual_rule/Index';
import AccrualRuleForm from '../pages/accrual_rule/Form';
import Error404 from '../pages/error/Error404';

const Router = ({ match }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <AccrualRuleIndex menucode="ACCRLRL" prefixmenuname="ACCRLRL" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => <AccrualRuleForm menucode="ACCRLRL" prefixmenuname="ACCRLRL" {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => <AccrualRuleForm menucode="ACCRLRL" prefixmenuname="ACCRLRL" {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;