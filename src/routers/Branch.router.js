import React from 'react';
import { Switch, Route } from 'react-router-dom';
import BranchIndex from '../pages/branch/Index';
import BranchForm from '../pages/branch/Form';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <BranchIndex menucode="BRANCH" prefixmenuname="BRANCH" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => (permission !== undefined && permission["BRANCH"]["BRANCH_CREATE"]) ? <BranchForm menucode="BRANCH" prefixmenuname="BRANCH" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && (permission["BRANCH"]["BRANCH_ACCESS"] || permission["BRANCH"]["BRANCH_UPDATE"])) ? <BranchForm menucode="BRANCH" prefixmenuname="BRANCH" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;