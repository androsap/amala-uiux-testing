import React from 'react';
import { Switch, Route } from 'react-router-dom';
import UserIndex from '../pages/user/Index';
import UserForm from '../pages/user/Form';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <UserIndex menucode="USER" prefixmenuname="USER" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => (permission !== undefined && permission["USER"]["USER_CREATE"]) ? <UserForm menucode="USER" prefixmenuname="USER" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && (permission["USER"]["USER_ACCESS"] || permission["USER"]["USER_UPDATE"])) ? <UserForm menucode="USER" prefixmenuname="USER" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;