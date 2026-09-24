import React from 'react';
import { Switch, Route } from 'react-router-dom';
import MembershipIndex from '../pages/membership/Index';
import MembershipForm from '../pages/membership/Form';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <MembershipIndex menucode="TIERMMSHIP" prefixmenuname="MSHIP" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => (permission !== undefined && permission["TIERMMSHIP"]["MSHIP_CREATE"]) ? <MembershipForm menucode="TIERMMSHIP" prefixmenuname="MSHIP" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && (permission["TIERMMSHIP"]["MSHIP_ACCESS"] || permission["TIERMMSHIP"]["MSHIP_UPDATE"])) ? <MembershipForm menucode="TIERMMSHIP" prefixmenuname="MSHIP" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;