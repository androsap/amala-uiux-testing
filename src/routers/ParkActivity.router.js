import React from 'react';
import { Switch, Route } from 'react-router-dom';
import ParkActivityIndex from '../pages/park_activity/Index';
import Error404 from '../pages/error/Error404';

const Router = ({ match }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <ParkActivityIndex menucode="PARKACTI" prefixmenuname="PARKACTI" {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;