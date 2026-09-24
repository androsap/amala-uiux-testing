import React from 'react';
import { Switch, Route } from 'react-router-dom';
import RCPartnerIndex from '../pages/rc_partner/Index';
import RCPartnerForm from '../pages/rc_partner/Form';
import Error404 from '../pages/error/Error404';

const Router = ({ match }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <RCPartnerIndex menucode="RETROCL" prefixmenuname="RETROCL" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => <RCPartnerForm menucode="RETROCL" prefixmenuname="RETROCL" {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => <RCPartnerForm menucode="RETROCL" prefixmenuname="RETROCL" {...props} />} />
		<Route exact path={match.url + '/form/:ID/:TYPE'} render={(props) => <RCPartnerForm menucode="RETROCL" prefixmenuname="RETROCL" {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;