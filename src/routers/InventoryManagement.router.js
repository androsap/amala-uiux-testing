import React from 'react';
import { Switch, Route } from 'react-router-dom';
import LanguageIndex from '../pages/mailing_product/inventory_management/Index';
import LanguageForm from '../pages/mailing_product/inventory_management/Form';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <LanguageIndex menucode="INVSYS" prefixmenuname="INVSYS" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => (permission !== undefined && permission["INVSYS"]["INVSYS_CREATE"]) ? <LanguageForm menucode="INVSYS" prefixmenuname="INVSYS" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && (permission["INVSYS"]["INVSYS_ACCESS"] || permission["INVSYS"]["INVSYS_UPDATE"])) ? <LanguageForm menucode="INVSYS" prefixmenuname="INVSYS" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;