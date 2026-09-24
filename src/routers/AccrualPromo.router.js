import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PromoIndex from '../pages/accrual_promo/Index';
import PromoForm from '../pages/accrual_promo/Form';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <PromoIndex menucode="ACCRLPR" prefixmenuname="ACCRLPR" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => (permission !== undefined && permission["ACCRLPR"]["ACCRLPR_ACCESS"]) ? <PromoForm menucode="ACCRLPR" prefixmenuname="ACCRLPR" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && (permission["ACCRLPR"]["ACCRLPR_ACCESS"] || permission["ACCRLPR"]["ACCRLPR_UPDATE"])) ? <PromoForm menucode="ACCRLPR" prefixmenuname="ACCRLPR" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;