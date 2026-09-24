import React from 'react';
import { Switch, Route } from 'react-router-dom';
import BlackoutIndex from '../pages/blackout/Index';
import BlackoutForm from '../pages/blackout/Form';
import Error404 from '../pages/error/Error404';

const Router = ({ match }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <BlackoutIndex menucode="BLACKOUT" prefixmenuname="BLACKOUT" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => <BlackoutForm menucode="BLACKOUT" prefixmenuname="BLACKOUT" {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => <BlackoutForm menucode="BLACKOUT" prefixmenuname="BLACKOUT" {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;