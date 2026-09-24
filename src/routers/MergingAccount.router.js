import React from 'react';
import { Switch, Route } from 'react-router-dom';
import MergingAccountIndex from '../pages/merging_account/Request';
import MergingAccountResult from '../pages/merging_account/Result';
import MergingAccountSearch from '../pages/merging_account/Index';
import MergingAccountDetail from '../pages/merging_account/Detail';
import Error404 from '../pages/error/Error404';

const Router = ({ match }) => (
	<Switch>
		<Route exact path={match.url + '/request'} render={(props) => <MergingAccountIndex menucode="MERACC" prefixmenuname="MERACC" {...props} />} />
		<Route exact path={match.url + '/result'} render={(props) => <MergingAccountResult menucode="MERACC" prefixmenuname="MERACC" {...props} />} />
		<Route exact path={match.url + '/detail/:ID'} render={(props) => <MergingAccountDetail menucode="MERACC" prefixmenuname="MERACC" {...props} />} />
		<Route exact path={match.url} render={(props) => <MergingAccountSearch menucode="MERACC" prefixmenuname="MERACC" {...props} />} />		
		<Route component={Error404} />
	</Switch>
);

export default Router;