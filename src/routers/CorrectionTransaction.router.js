import React from 'react';
import { Switch, Route } from 'react-router-dom';
import CorrectionTransactionIndex from '../pages/correction_transaction/Index';
import Error404 from '../pages/error/Error404';

const Router = ({ match }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <CorrectionTransactionIndex menucode="MERACC" prefixmenuname="MERACC" {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;