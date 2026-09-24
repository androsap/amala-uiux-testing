import React from 'react';
import { Switch, Route } from 'react-router-dom';
import MembershipTypeIndex from '../pages/membership_type/Index';
import MembershipTypeForm from '../pages/membership_type/Form';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <MembershipTypeIndex menucode="TIERMMSHIPTYPE" prefixmenuname="MBSPTYPE" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => (permission !== undefined && permission["TIERMMSHIPTYPE"]["MBSPTYPE_CREATE"]) ? <MembershipTypeForm menucode="TIERMMSHIPTYPE" prefixmenuname="MBSPTYPE" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && (permission["TIERMMSHIPTYPE"]["MBSPTYPE_ACCESS"] || permission["TIERMMSHIPTYPE"]["MBSPTYPE_UPDATE"])) ? <MembershipTypeForm menucode="TIERMMSHIPTYPE" prefixmenuname="MBSPTYPE" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;