import React from 'react';
import { Switch, Route } from 'react-router-dom';
import MemberPromoIndex from '../pages/promo_management/member_promo/Index';
import MemberPromoForm from '../pages/promo_management/member_promo/Form';
import Error403 from '../pages/error/Error403';
import Error404 from '../pages/error/Error404';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <MemberPromoIndex menucode="MMBRPRM" prefixmenuname="MMBRPRM" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => (permission !== undefined && permission["MMBRPRM"]["MMBRPRM_CREATE"]) ? <MemberPromoForm menucode="MMBRPRM" prefixmenuname="MMBRPRM" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;