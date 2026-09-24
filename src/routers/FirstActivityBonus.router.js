import React from 'react';
import { Switch, Route } from 'react-router-dom';
import FirstActivityBonusIndex from '../pages/first_activity_bonus/Index';
import FirstActivityBonusForm from '../pages/first_activity_bonus/Form';
import Error404 from '../pages/error/Error404';

const Router = ({match}) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <FirstActivityBonusIndex menucode="TIERMFACTBONUS" prefixmenuname="FACBONUS" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => <FirstActivityBonusForm menucode="TIERMFACTBONUS" prefixmenuname="FACBONUS" {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => <FirstActivityBonusForm menucode="TIERMFACTBONUS" prefixmenuname="FACBONUS" {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;