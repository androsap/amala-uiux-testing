import React from 'react';
import { Switch, Route } from 'react-router-dom';
import CurrencyIndex from '../pages/currency/Index';
import CurrencyForm from '../pages/currency/Form';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <CurrencyIndex menucode="MSDTCURRENCY" prefixmenuname="CURRENCY" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => (permission !== undefined && permission["MSDTCURRENCY"]["CURRENCY_CREATE"]) ? <CurrencyForm menucode="MSDTCURRENCY" prefixmenuname="CURRENCY" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && (permission["MSDTCURRENCY"]["CURRENCY_ACCESS"] || permission["MSDTCURRENCY"]["CURRENCY_UPDATE"])) ? <CurrencyForm menucode="MSDTCURRENCY" prefixmenuname="CURRENCY" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;