import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PromoCompletionBonus from '../pages/completion_bonus_promo/Index';
import PromoCompletionBonusForm from '../pages/completion_bonus_promo/Form';
import Error404 from '../pages/error/Error404';

const Router = ({match}) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <PromoCompletionBonus menucode="PROMBON" prefixmenuname="PROMBON" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => <PromoCompletionBonusForm menucode="PROMBON" prefixmenuname="PROMBON" {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => <PromoCompletionBonusForm menucode="PROMBON" prefixmenuname="PROMBON" {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;