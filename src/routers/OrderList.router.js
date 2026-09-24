import React from 'react';
import { Switch, Route } from 'react-router-dom';
import OrderListIndex from '../pages/order_management/printing';
import OrderListForm from '../pages/order_management/printing/Details';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <OrderListIndex menucode="PRTD" prefixmenuname="PRTD" {...props} />} />
		<Route exact path={match.url + '/details/:ID'} render={(props) => <OrderListForm menucode="PRTD" prefixmenuname="PRTD" {...props} />} />
	</Switch>
);

export default Router;