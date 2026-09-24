import React from 'react';
import { Switch, Route } from 'react-router-dom';
import UserIndex from '../pages/user_log/Index';
import UserLegend from '../pages/user_log/Legends';
import UserDetails from '../pages/user_log/Details';
import Error404 from '../pages/error/Error404';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <UserIndex menucode="USERLOG" prefixmenuname="USERLOG" {...props} />} />
		<Route exact path={match.url + '/legends'} render={(props) => <UserLegend menucode="USERLOG" prefixmenuname="USERLOG" {...props} />} />
		<Route exact path={match.url + '/details/:ID'} render={(props) => <UserDetails menucode="USERLOG" prefixmenuname="USERLOG" {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;