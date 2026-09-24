import React from 'react';
import { Switch, Route } from 'react-router-dom';
import TransferMileageForm from '../pages/transfer_mileage/Form';
import Error404 from '../pages/error/Error404';

const Router = ({ match }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <TransferMileageForm menucode="TRFMIL" prefixmenuname="TRFMIL" {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;