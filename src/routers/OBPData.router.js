import React from 'react';
import { Switch, Route } from 'react-router-dom';
import OBPIndex from '../pages/obp/Index';
import OBPForm from '../pages/obp/Form';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <OBPIndex menucode="OBP" prefixmenuname="OBP" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => (permission !== undefined && permission["OBP"]["OBP_CREATE"]) ? <OBPForm menucode="OBP" prefixmenuname="OBP" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && (permission["OBP"]["OBP_ACCESS"] || permission["OBP"]["OBP_UPDATE"])) ? <OBPForm menucode="OBP" prefixmenuname="OBP" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>


);

export default Router;