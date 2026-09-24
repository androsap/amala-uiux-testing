import React from 'react';
import { Switch, Route } from 'react-router-dom';
import MemberPromoIndex from '../pages/promo_management/promo_registration/Index';
import MemberPromoForm from '../pages/promo_management/promo_registration/Form';
import Error403 from '../pages/error/Error403';
import Error404 from '../pages/error/Error404';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <MemberPromoIndex menucode="PRMREGIS" prefixmenuname="PRMREGIS" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => (permission !== undefined && permission["PRMREGIS"]["PRMREGIS_CREATE"]) ? <MemberPromoForm menucode="PRMREGIS" prefixmenuname="PRMREGIS" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;