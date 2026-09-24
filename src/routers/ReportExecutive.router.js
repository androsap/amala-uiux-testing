import React from 'react';
import { Switch, Route } from 'react-router-dom';
import ExecutiveIndex from '../pages/report_executive/Index';
import Error404 from '../pages/error/Error404';

const Router = ({ match }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <ExecutiveIndex menucode="RDASEXE" prefixmenuname="RDASEXE" {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;