import React from 'react';
import { Switch, Route } from 'react-router-dom';
import TierIndex from '../pages/tier/Index';
import TierForm from '../pages/tier/Form';
import Error404 from '../pages/error/Error404';

const Router = ({match}) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <TierIndex menucode="TIERMTIER" prefixmenuname="TIER" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => <TierForm menucode="TIERMTIER" prefixmenuname="TIER" {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => <TierForm menucode="TIERMTIER" prefixmenuname="TIER" {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;