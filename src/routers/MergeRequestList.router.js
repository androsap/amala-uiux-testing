import React from 'react';
import { Switch, Route } from 'react-router-dom';
import RequestListIndex from '../pages/merging_account_approval/Index';
import RequestListForm from '../pages/merging_account_approval/Detail';

import Error404 from '../pages/error/Error404';

const Router = ({ match }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <RequestListIndex menucode="MERACC" prefixmenuname="MERACC" {...props} />} />
		<Route exact path={match.url + '/detail'} render={(props) => <RequestListForm menucode="MERACC" prefixmenuname="MERACC" {...props} />} />
		<Route exact path={match.url + '/detail/:ID'} render={(props) => <RequestListForm menucode="MERACC" prefixmenuname="MERACC" {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;