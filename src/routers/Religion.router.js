import React from 'react';
import { Switch, Route } from 'react-router-dom';
import ReligionIndex from '../pages/religion/Index';
import ReligionForm from '../pages/religion/Form';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <ReligionIndex menucode="MSDTRELIGION" prefixmenuname="RELIGION" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => (permission !== undefined && permission["MSDTRELIGION"]["RELIGION_CREATE"]) ? <ReligionForm menucode="MSDTRELIGION" prefixmenuname="RELIGION" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && (permission["MSDTRELIGION"]["RELIGION_ACCESS"] || permission["MSDTRELIGION"]["RELIGION_UPDATE"])) ? <ReligionForm menucode="MSDTRELIGION" prefixmenuname="RELIGION" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;