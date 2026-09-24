import React from 'react';
import { Switch, Route } from 'react-router-dom';
import DataSyncIndex from '../pages/data_sync/Index';
import DataSyncChecking from '../pages/data_sync/Checking';
import Error404 from '../pages/error/Error404';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={'/data-sync-monitoring'} render={(props) => <DataSyncIndex menucode="DSMON" prefixmenuname="DSMON" {...props} />} />
		<Route exact path={'/data-sync-checking'} render={(props) => <DataSyncChecking menucode="DSCHCK" prefixmenuname="DSCHCK" {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;