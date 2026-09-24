import React from 'react';
import { Switch, Route } from 'react-router-dom';
import BizmilesIndex from '../pages/report_fraud_suspect/Index';
import Error404 from '../pages/error/Error404';

const Router = ({ match }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <BizmilesIndex menucode="REPFSUS" prefixmenuname="REPFSUS" {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;