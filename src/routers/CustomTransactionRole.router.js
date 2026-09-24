import React from 'react';
import { Switch, Route } from 'react-router-dom';
import CustomTransactionIndex from '../pages/custom_transaction_role/Index';
import CustomTransactionForm from '../pages/custom_transaction_role/Form';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <CustomTransactionIndex menucode="CUSTROLE" prefixmenuname="CUSTROLE" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => (permission !== undefined && permission["CUSTROLE"]["CUSTROLE_CREATE"]) ? <CustomTransactionForm menucode="CUSTROLE" prefixmenuname="CUSTROLE" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && (permission["CUSTROLE"]["CUSTROLE_ACCESS"] || permission["CUSTROLE"]["CUSTROLE_UPDATE"])) ? <CustomTransactionForm menucode="CUSTROLE" prefixmenuname="CUSTROLE" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;