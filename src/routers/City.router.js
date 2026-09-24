import React from 'react';
import { Switch, Route } from 'react-router-dom';
import CityIndex from '../pages/city/Index';
import CityForm from '../pages/city/Form';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <CityIndex menucode="MSDTCITY" prefixmenuname="CITY" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => (permission !== undefined && permission["MSDTCITY"]["CITY_CREATE"]) ? <CityForm menucode="MSDTCITY" prefixmenuname="CITY" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && (permission["MSDTCITY"]["CITY_ACCESS"] || permission["MSDTCITY"]["CITY_UPDATE"])) ? <CityForm menucode="MSDTCITY" prefixmenuname="CITY" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;