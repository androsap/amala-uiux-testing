import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Index from '../pages/approval/buy_mileage/Index';
import Form from '../pages/approval/buy_mileage/Form.js';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <Index menucode="APPRBML" prefixmenuname="APPRBML" {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && (permission["APPRBML"]["APPRBML_ACCESS"] || permission["APPRBML"]["APPRBML_UPDATE"])) ? <Form menucode="APPRBML" prefixmenuname="APPRBML" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;
