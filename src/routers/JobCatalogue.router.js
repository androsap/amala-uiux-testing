import React from 'react';
import { Switch, Route } from 'react-router-dom';
import JobCatalogueIndex from '../pages/job_catalogue/Index';
import JobCatalogueForm from '../pages/job_catalogue/Form';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <JobCatalogueIndex menucode="JOBCTLG" prefixmenuname="JOBCTLG" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => (permission !== undefined && permission["JOBCTLG"]["JOBCTLG_CREATE"]) ? <JobCatalogueForm menucode="JOBCTLG" prefixmenuname="JOBCTLG" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && (permission["JOBCTLG"]["JOBCTLG_ACCESS"] || permission["JOBCTLG"]["JOBCTLG_UPDATE"])) ? <JobCatalogueForm menucode="JOBCTLG" prefixmenuname="JOBCTLG" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;