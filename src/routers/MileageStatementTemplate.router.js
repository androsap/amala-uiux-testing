import React from 'react';
import { Switch, Route } from 'react-router-dom';
import MileageStatementTemplateIndex from '../pages/mileage_statement_template/Index';
import MileageStatementTemplateForm from '../pages/mileage_statement_template/Form';
import Error403 from '../pages/error/Error403';
import Error404 from '../pages/error/Error404';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <MileageStatementTemplateIndex menucode="MISTMTEM" prefixmenuname="MISTMTEM" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => (permission !== undefined && permission["MISTMTEM"]["MISTMTEM_CREATE"]) ? <MileageStatementTemplateForm menucode="MISTMTEM" prefixmenuname="MISTMTEM" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && (permission["MISTMTEM"]["MISTMTEM_ACCESS"] || permission["MISTMTEM"]["MISTMTEM_UPDATE"])) ? <MileageStatementTemplateForm menucode="MISTMTEM" prefixmenuname="MISTMTEM" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);


export default Router;
