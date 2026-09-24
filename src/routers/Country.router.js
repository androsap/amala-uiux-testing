import React from 'react';
import { Switch, Route } from 'react-router-dom';
import CountryIndex from '../pages/country/Index';
import CountryForm from '../pages/country/Form';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <CountryIndex menucode="MSDTCOUNTRY" prefixmenuname="COUNTRY" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => (permission !== undefined && permission["MSDTCOUNTRY"]["COUNTRY_CREATE"]) ? <CountryForm menucode="MSDTCOUNTRY" prefixmenuname="COUNTRY" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && (permission["MSDTCOUNTRY"]["COUNTRY_ACCESS"] || permission["MSDTCOUNTRY"]["COUNTRY_UPDATE"])) ? <CountryForm menucode="MSDTCOUNTRY" prefixmenuname="COUNTRY" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;