import React from 'react';
import { Switch, Route } from 'react-router-dom';
import ActivityCodeIndex from '../pages/activity_code/Index';
import ActivityCodeForm from '../pages/activity_code/Form';
import Error404 from '../pages/error/Error404';

const Router = ({ match }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <ActivityCodeIndex menucode="ACTYCODE" prefixmenuname="ACTYCODE" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => <ActivityCodeForm menucode="ACTYCODE" prefixmenuname="ACTYCODE" {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => <ActivityCodeForm menucode="ACTYCODE" prefixmenuname="ACTYCODE" {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;