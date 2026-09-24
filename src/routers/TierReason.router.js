import React from 'react';
import { Switch, Route } from 'react-router-dom';
import TierReasonIndex from '../pages/tier_reason/Index';
import TierReasonForm from '../pages/tier_reason/Form';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <TierReasonIndex menucode="TIERMTIREASON" prefixmenuname="TIREASON" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => (permission !== undefined && permission["TIERMTIREASON"]["TIREASON_CREATE"]) ? <TierReasonForm menucode="TIERMTIREASON" prefixmenuname="TIREASON" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && (permission["TIERMTIREASON"]["TIREASON_ACCESS"] || permission["TIERMTIREASON"]["TIREASON_UPDATE"])) ? <TierReasonForm menucode="TIERMTIREASON" prefixmenuname="TIREASON" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;