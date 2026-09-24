import React from 'react';
import { Switch, Route } from 'react-router-dom';
import EarningMilesIndex from '../pages/earning_miles/Index';
import EarningMilesForm from '../pages/earning_miles/Form';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <EarningMilesIndex menucode="EARMILES" prefixmenuname="EARMILES" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => (permission !== undefined && permission["EARMILES"]["EARMILES_CREATE"]) ? <EarningMilesForm menucode="EARMILES" prefixmenuname="EARMILES" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && (permission["EARMILES"]["EARMILES_ACCESS"] || permission["EARMILES"]["EARMILES_UPDATE"])) ? <EarningMilesForm menucode="EARMILES" prefixmenuname="EARMILES" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;