import React from 'react';
import { Switch, Route } from 'react-router-dom';
import BMCatalogIndex from '../pages/buy_mileage_catalog/Index';
import BMCatalogForm from '../pages/buy_mileage_catalog/Form';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <BMCatalogIndex menucode="BUYMILCT" prefixmenuname="BUYMILCT" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => (permission !== undefined && permission["BUYMILCT"]["BUYMILCT_CREATE"]) ? <BMCatalogForm menucode="BUYMILCT" prefixmenuname="BUYMILCT" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && (permission["BUYMILCT"]["BUYMILCT_ACCESS"] || permission["BUYMILCT"]["BUYMILCT_UPDATE"])) ? <BMCatalogForm menucode="BUYMILCT" prefixmenuname="BUYMILCT" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;