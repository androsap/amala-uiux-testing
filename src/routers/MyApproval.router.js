import React from 'react';
import { Switch, Route } from 'react-router-dom';
import MyApprovalIndex from '../pages/my_approval/Index';
import MyApprovalView from '../pages/my_approval/View';
import Error403 from '../pages/error/Error403';
import Error404 from '../pages/error/Error404';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <MyApprovalIndex menucode="MYAPPR" prefixmenuname="MYAPPR" {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && permission["MYAPPR"]["MYAPPR_UPDATE"]) ? <MyApprovalView menucode="MYAPPR" prefixmenuname="MYAPPR" type="UPDATE" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;
