import React from 'react';
import { Switch, Route } from 'react-router-dom';
import TransferMileageIndex from '../pages/transfer_mileage_log/Index';
import Error404 from '../pages/error/Error404';

const Router = ({ match }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <TransferMileageIndex menucode="MILLOG" prefixmenuname="MILLOG" {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;