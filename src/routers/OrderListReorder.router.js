import React from 'react';
import { Switch, Route } from 'react-router-dom';
import OrderListIndex from '../pages/order_management/reorder/index';
import OrderListForm from '../pages/order_management/reorder/Details';
// import OrderListFormProgress from '../pages/order-management/reorder/DetailsProgress';
// import OrderListFormFinish from '../pages/order-management/reorder/DetailsFinish';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <OrderListIndex menucode="REORDER" prefixmenuname="REORDER" {...props} />} />
		<Route exact path={match.url + '/details/:ID'} render={(props) => <OrderListForm menucode="REORDER" prefixmenuname="REORDER" {...props} />} />
		{/* <Route exact path={match.url + '/DetailsProgress/:ID'} render={(props) => <OrderListFormProgress menucode="PRTD" prefixmenuname="PRTD" {...props} /> } /> 
		<Route exact path={match.url + '/DetailsFinish/:ID'} render={(props) => <OrderListFormFinish menucode="PRTD" prefixmenuname="PRTD" {...props} /> } /> */}
	</Switch>
);

export default Router;