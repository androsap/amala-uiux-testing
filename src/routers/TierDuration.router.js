import React from 'react';
import { Switch, Route } from 'react-router-dom';
import TierDurationIndex from '../pages/tier_duration/Index';
import TierDurationForm from '../pages/tier_duration/Form';
import TierDurationFormCreate from '../pages/tier_duration/Create';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <TierDurationIndex menucode="TIERMTIDURATION" prefixmenuname="TIDURATI" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => (permission !== undefined && permission["TIERMTIDURATION"] && permission["TIERMTIDURATION"]["TIDURATI_CREATE"]) ? <TierDurationFormCreate menucode="TIERMTIDURATION" prefixmenuname="TIDURATI" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => <TierDurationForm menucode="TIERMTIDURATION" prefixmenuname="TIDURATI" {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;