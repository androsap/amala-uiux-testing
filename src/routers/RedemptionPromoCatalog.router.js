import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PromoCatalogIndex from '../pages/promo_catalog/Index';
import PromoCatalogForm from '../pages/promo_catalog/Form';
import Error404 from '../pages/error/Error404';

const Router = ({ match }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <PromoCatalogIndex menucode="PROMCT" prefixmenuname="PROMCT" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => <PromoCatalogForm menucode="PROMCT" prefixmenuname="PROMCT" {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => <PromoCatalogForm menucode="PROMCT" prefixmenuname="PROMCT" {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;
