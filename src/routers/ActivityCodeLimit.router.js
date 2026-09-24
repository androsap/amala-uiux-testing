import React from 'react';
import { Switch, Route } from 'react-router-dom';
import ActivityLimitIndex from '../pages/activity_code_limit/Index';
import ActivityLimitForm from '../pages/activity_code_limit/Form';
import Error404 from '../pages/error/Error404';

const Router = ({ match }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <ActivityLimitIndex menucode="ACCRLLMTNA" prefixmenuname="ACCRLLMTNA" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => <ActivityLimitForm menucode="ACCRLLMTNA" prefixmenuname="ACCRLLMTNA" {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => <ActivityLimitForm menucode="ACCRLLMTNA" prefixmenuname="ACCRLLMTNA" {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;