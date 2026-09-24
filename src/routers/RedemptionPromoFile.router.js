import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PromoFileIndex from '../pages/promo_file/Index';
import PromoFileForm from '../pages/promo_file/Form';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <PromoFileIndex menucode="PROFILE" prefixmenuname="PROFILE" {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && (permission["PROFILE"]["PROFILE_ACCESS"])) ? <PromoFileForm menucode="PROFILE" prefixmenuname="PROFILE" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;