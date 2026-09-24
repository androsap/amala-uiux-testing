import React from 'react';
import { Switch, Route } from 'react-router-dom';
import OrderListIndex from '../pages/order_management/track/Index';
import OrderListForm from '../pages/order_management/track/TrackOrder';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <OrderListIndex menucode="RETURN" prefixmenuname="RETURN" {...props} />} />
		<Route exact path={match.url + '/details/:ID'} render={(props) => <OrderListForm menucode="RETURN" prefixmenuname="RETURN" {...props} />} />
	</Switch>
);

export default Router;