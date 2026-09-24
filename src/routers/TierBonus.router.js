import React from 'react';
import { Switch, Route } from 'react-router-dom';
import TierBonusIndex from '../pages/tier_bonus/Index';
import TierBonusForm from '../pages/tier_bonus/Form';
import Error404 from '../pages/error/Error404';

const Router = ({match}) => (
	<Switch>
		<Route exact path={match.url} component={TierBonusIndex}/>
		<Route exact path={match.url + '/form'} component={TierBonusForm}/>
		<Route exact path={match.url + '/form/:ID'} component={TierBonusForm}/>
		<Route component={Error404}/>
	</Switch>
);

export default Router;