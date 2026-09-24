import React from 'react';
import { Switch, Route } from 'react-router-dom';
import BizmilesIndex from '../pages/report_bizmiles/Index';
import Error404 from '../pages/error/Error404';

const Router = ({ match }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <BizmilesIndex menucode="RDASBIZ" prefixmenuname="RDASBIZ" {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;