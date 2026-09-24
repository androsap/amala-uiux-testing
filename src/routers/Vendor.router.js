import React from 'react';
import { Switch, Route } from 'react-router-dom';
import VendorIndex from '../pages/vendor/Index';
import VendorForm from '../pages/vendor/Form';
import Error404 from '../pages/error/Error404';

const Router = ({ match }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <VendorIndex menucode="VENDOR" prefixmenuname="VENDOR" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => <VendorForm menucode="VENDOR" prefixmenuname="VENDOR" {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => <VendorForm menucode="VENDOR" prefixmenuname="VENDOR" {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;