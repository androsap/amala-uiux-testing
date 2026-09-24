import React from 'react';
import { Switch, Route } from 'react-router-dom';
import LanguageIndex from '../pages/language/Index';
import LanguageForm from '../pages/language/Form';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <LanguageIndex menucode="MSDTLANGUAGE" prefixmenuname="LANGUAGE" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => (permission !== undefined && permission["MSDTLANGUAGE"]["LANGUAGE_CREATE"]) ? <LanguageForm menucode="MSDTLANGUAGE" prefixmenuname="LANGUAGE" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && (permission["MSDTLANGUAGE"]["LANGUAGE_ACCESS"] || permission["MSDTLANGUAGE"]["LANGUAGE_UPDATE"])) ? <LanguageForm menucode="MSDTLANGUAGE" prefixmenuname="LANGUAGE" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;