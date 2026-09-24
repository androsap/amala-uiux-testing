import React from 'react';
import { Switch, Route } from 'react-router-dom';
import OrderListIndex from '../pages/order_management/packaging';
import OrderListForm from '../pages/order_management/packaging/Details';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <OrderListIndex menucode="PCKD" prefixmenuname="PCKD" {...props} />} />
		<Route exact path={match.url + '/details/:ID'} render={(props) => <OrderListForm menucode="PCKD" prefixmenuname="PCKD" {...props} />} />
	</Switch>
);

export default Router;