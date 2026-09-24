import React from 'react';
import { Switch, Route } from 'react-router-dom';
import FileManagementIndex from '../pages/file_management/Index';
import Error404 from '../pages/error/Error404';

const Router = ({ match }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <FileManagementIndex menucode="BILLING" prefixmenuname="BILLING" {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;