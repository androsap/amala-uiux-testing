import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PeakSeasonIndex from '../pages/peak_season/Index';
import PeakSeasonForm from '../pages/peak_season/Form';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <PeakSeasonIndex menucode="PEAKSEAS" prefixmenuname="PEAKSEAS" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => (permission !== undefined && permission["PEAKSEAS"]["PEAKSEAS_CREATE"]) ? <PeakSeasonForm menucode="PEAKSEAS" prefixmenuname="PEAKSEAS" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && (permission["PEAKSEAS"]["PEAKSEAS_ACCESS"] || permission["PEAKSEAS"]["PEAKSEAS_UPDATE"])) ? <PeakSeasonForm menucode="PEAKSEAS" prefixmenuname="PEAKSEAS" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;