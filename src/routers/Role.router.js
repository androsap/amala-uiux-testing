import React from 'react';
import { Switch, Route } from 'react-router-dom';
import RoleIndex from '../pages/role/Index';
import RoleForm from '../pages/role/Form';
import Error404 from '../pages/error/Error404';

const Router = ({ match }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <RoleIndex menucode="ROLE" prefixmenuname="ROLE" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => <RoleForm menucode="ROLE" prefixmenuname="ROLE" {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => <RoleForm menucode="ROLE" prefixmenuname="ROLE" {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;