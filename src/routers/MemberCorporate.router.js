import React from 'react';
import { Switch, Route } from 'react-router-dom';
import MemberCorporateIndex from '../pages/member_corporate/Index';
import MemberCorporateForm from '../pages/member_corporate/Form';
import Error404 from '../pages/error/Error404';

const Router = ({ match }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <MemberCorporateIndex menucode="MBERCORP" prefixmenuname="MBERCORP" {...props} />} />
		<Route path={match.url + '/form/:ID'} render={(props) => <MemberCorporateForm menucode="MBERCORP" prefixmenuname="MBERCORP" {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;