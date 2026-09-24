import React from 'react';
import { Switch, Route } from 'react-router-dom';
import GeneralConfigurationIndex from '../pages/general_configuration/Index';
import GeneralConfigurationForm from '../pages/general_configuration/Form';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <GeneralConfigurationIndex menucode="MSDTGENCONFIG" prefixmenuname="GENCONF" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => (permission !== undefined && permission["MSDTGENCONFIG"]["GENCONF_CREATE"]) ? <GeneralConfigurationForm menucode="MSDTGENCONFIG" prefixmenuname="GENCONF" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && (permission["MSDTGENCONFIG"]["GENCONF_ACCESS"] || permission["MSDTGENCONFIG"]["GENCONF_UPDATE"])) ? <GeneralConfigurationForm menucode="MSDTGENCONFIG" prefixmenuname="GENCONF" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;