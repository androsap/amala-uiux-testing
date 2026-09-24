import React from 'react';
import { Switch, Route } from 'react-router-dom';
import RegionIndex from '../pages/region/Index';
import RegionForm from '../pages/region/Form';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <RegionIndex menucode="MSDTREGION" prefixmenuname="REGION" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => (permission !== undefined && permission["MSDTREGION"]["REGION_CREATE"]) ? <RegionForm menucode="MSDTREGION" prefixmenuname="REGION" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && (permission["MSDTREGION"]["REGION_ACCESS"] || permission["MSDTREGION"]["REGION_UPDATE"])) ? <RegionForm menucode="MSDTREGION" prefixmenuname="REGION" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;