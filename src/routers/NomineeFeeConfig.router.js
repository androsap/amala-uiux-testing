import React from 'react';
import { Switch, Route } from 'react-router-dom';
import NomineeFeeConfig from '../pages/nominee_fee_config/Index';
import NomineeFeeConfigForm from '../pages/nominee_fee_config/Form';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <NomineeFeeConfig menucode="NOMIFEE" prefixmenuname="NOMIFEE" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => (permission !== undefined && permission["NOMIFEE"]["NOMIFEE_CREATE"]) ? <NomineeFeeConfigForm menucode="NOMIFEE" prefixmenuname="NOMIFEE" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && (permission["NOMIFEE"]["NOMIFEE_ACCESS"] || permission["NOMIFEE"]["NOMIFEEUPDATE"])) ? <NomineeFeeConfigForm menucode="NOMIFEE" prefixmenuname="NOMIFEE" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;