import React from 'react';
import { Switch, Route } from 'react-router-dom';
import MemberIdentityIndex from '../pages/member_identity/Index';
import Error404 from '../pages/error/Error404';

const Router = ({ match }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <MemberIdentityIndex menucode="MMBRIDT" prefixmenuname="MMBRIDT" {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;