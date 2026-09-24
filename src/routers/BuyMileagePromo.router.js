import React from 'react';
import { Switch, Route } from 'react-router-dom';
import BMPromoIndex from '../pages/buy_mileage_promo/Index';
import BMPromoForm from '../pages/buy_mileage_promo/Form';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <BMPromoIndex menucode="BUYMILPR" prefixmenuname="BUYMILPR" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => (permission !== undefined && permission["BUYMILPR"]["BUYMILPR_CREATE"]) ? <BMPromoForm menucode="BUYMILPR" prefixmenuname="BUYMILPR" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && (permission["BUYMILPR"]["BUYMILPR_ACCESS"] || permission["BUYMILPR"]["BUYMILPR_UPDATE"])) ? <BMPromoForm menucode="BUYMILPR" prefixmenuname="BUYMILPR" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;