import React from 'react';
import { Switch, Route } from 'react-router-dom';
import BillingIndex from '../pages/billing/Index';
import BillingForm from '../pages/billing/Form';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <BillingIndex menucode="BILLING" prefixmenuname="BILLING" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => (permission !== undefined && permission["BILLING"]["BILLING_CREATE"]) ? <BillingForm menucode="BILLING" prefixmenuname="BILLING" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && (permission["BILLING"]["BILLING_ACCESS"] || permission["BILLING"]["BILLING_UPDATE"])) ? <BillingForm menucode="BILLING" prefixmenuname="BILLING" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;