import React from 'react';
import { Switch, Route } from 'react-router-dom';
import ActivityBonusIndex from '../pages/activity_bonus/Index';
import ActivityBonusForm from '../pages/activity_bonus/Form';
import Error404 from '../pages/error/Error404';

const Router = ({match}) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <ActivityBonusIndex menucode="TIERMACTBONUS" prefixmenuname="ACTBONUS" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => <ActivityBonusForm menucode="TIERMACTBONUS" prefixmenuname="ACTBONUS" {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => <ActivityBonusForm menucode="TIERMACTBONUS" prefixmenuname="ACTBONUS" {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;