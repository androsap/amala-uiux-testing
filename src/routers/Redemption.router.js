import React from 'react';
import { Switch, Route } from 'react-router-dom';
import RedemptionIndex from '../pages/redemption/Index';
import MemberRedemptionIndex from '../pages/redemption/member_redemption/Index';
import RedemptionFreeFlight from '../pages/redemption/freeflight_redemption/Index';
import RedemptionNonAir from '../pages/redemption/non_air_redemption/Index';
import RedemptionUpgrade from '../pages/redemption/upgrade_redemption/Index';
import Error404 from '../pages/error/Error404';

const Router = ({match}) => (
	<Switch>
		<Route exact path={match.url} component={RedemptionIndex}/>
		<Route exact path={match.url + '/:cardnumber'} component={MemberRedemptionIndex}/>
		<Route exact path={match.url + '/:cardnumber/freeflight/:awardcode'} component={RedemptionFreeFlight}/>
		<Route exact path={match.url + '/:cardnumber/non_air/:awardcode'} component={RedemptionNonAir}/>
		<Route exact path={match.url + '/:cardnumber/upgrade/:awardcode'} component={RedemptionUpgrade}/>
		<Route component={Error404}/>
	</Switch>
);

export default Router;