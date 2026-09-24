import React from 'react';
import { Switch, Route } from 'react-router-dom';
import AwardTypeIndex from '../pages/award_type/Index';
import AwardTypeForm from '../pages/award_type/Form';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <AwardTypeIndex menucode="AWRDTYPE" prefixmenuname="AWRDTYPE" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => (permission !== undefined && permission["AWRDTYPE"]["AWRDTYPE_CREATE"]) ? <AwardTypeForm menucode="AWRDTYPE" prefixmenuname="AWRDTYPE" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && (permission["AWRDTYPE"]["AWRDTYPE_ACCESS"] || permission["AWRDTYPE"]["AWRDTYPE_UPDATE"])) ? <AwardTypeForm menucode="AWRDTYPE" prefixmenuname="AWRDTYPE" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;