import React from 'react';
import { Switch, Route } from 'react-router-dom';
import OrderListIndex from '../pages/order_management/delivery';
import OrderListForm from '../pages/order_management/delivery/Details';


const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <OrderListIndex menucode="DLVRD" prefixmenuname="DLVRD" {...props} />} />
		<Route exact path={match.url + '/details/:ID'} render={(props) => <OrderListForm menucode="DLVRD" prefixmenuname="DLVRD" {...props} />} />
	</Switch>
);

export default Router;