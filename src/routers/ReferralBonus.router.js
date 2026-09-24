import React from 'react';
import { Switch, Route } from 'react-router-dom';
import ReferralBonusIndex from '../pages/referral_bonus/Index';
import ReferralBonusForm from '../pages/referral_bonus/Form';
import Error404 from '../pages/error/Error404';

const Router = ({ match }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <ReferralBonusIndex menucode="REFFBON" prefixmenuname="REFFBON" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => <ReferralBonusForm menucode="REFFBON" prefixmenuname="REFFBON" {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => <ReferralBonusForm menucode="REFFBON" prefixmenuname="REFFBON" {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;