import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PerformanceIndex from '../pages/report_performance/Index';
import Error404 from '../pages/error/Error404';

const Router = ({ match }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <PerformanceIndex menucode="RDASPER" prefixmenuname="RDASPER" {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;