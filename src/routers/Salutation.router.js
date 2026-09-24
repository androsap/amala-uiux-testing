import React from 'react';
import { Switch, Route } from 'react-router-dom';
import SalutationIndex from '../pages/salutation/Index';
import SalutationForm from '../pages/salutation/Form';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <SalutationIndex menucode="MSDTSALUTATION" prefixmenuname="SALUTATI" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => (permission !== undefined && permission["MSDTSALUTATION"]["SALUTATI_CREATE"]) ? <SalutationForm menucode="MSDTSALUTATION" prefixmenuname="SALUTATI" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && (permission["MSDTSALUTATION"]["SALUTATI_ACCESS"] || permission["MSDTSALUTATION"]["SALUTATI_UPDATE"])) ? <SalutationForm menucode="MSDTSALUTATION" prefixmenuname="SALUTATI" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;