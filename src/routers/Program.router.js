import React from 'react';
import { Switch, Route } from 'react-router-dom';
import ProgramIndex from '../pages/program/Index';
import ProgramForm from '../pages/program/Form';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <ProgramIndex menucode="PROGLOYAL" prefixmenuname="PRGLOYAL" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => (permission !== undefined && permission["PROGLOYAL"]["PRGLOYAL_CREATE"]) ? <ProgramForm menucode="PROGLOYAL" prefixmenuname="PRGLOYAL" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && (permission["PROGLOYAL"]["PRGLOYAL_ACCESS"] || permission["PROGLOYAL"]["PRGLOYAL_UPDATE"])) ? <ProgramForm menucode="PROGLOYAL" prefixmenuname="PRGLOYAL" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;