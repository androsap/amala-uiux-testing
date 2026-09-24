import React from 'react';
import { Switch, Route } from 'react-router-dom';
import MemberIndex from '../pages/member/Index';
import MemberForm from '../pages/member/Form';
import Error404 from '../pages/error/Error404';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <MemberIndex menucode={"MEMBERMG" || "BMEMMGT"} prefixmenuname={"MEMBERMG" || "BMEMMGT"} {...props} {...permission} />} />
		<Route path={match.url + '/form/:ID'} render={(props) => <MemberForm menucode={"MEMBERMG" || "BMEMMGT"} prefixmenuname={"MEMBERMG" || "BMEMMGT"} {...props} {...permission} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;