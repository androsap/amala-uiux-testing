import React from 'react';
import { Switch, Route } from 'react-router-dom';
import InvalidNameCheckIndex from '../pages/invalid_name_check/Index';
import Error404 from '../pages/error/Error404';

const Router = ({ match }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <InvalidNameCheckIndex menucode="INCNAME" prefixmenuname="INCNAME" {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;