import React from 'react';
import { Switch, Route } from 'react-router-dom';
import EnrollmentCorporate from '../pages/enrollment_corporate/Create';
import EnrollmentResult from '../pages/enrollment_corporate/Result';
import Error404 from '../pages/error/Error404';

const Router = ({ match }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <EnrollmentCorporate menucode="ENRLCORP" prefixmenuname="ENRLCORP" {...props} />} />
		<Route exact path={match.url + '/result'} component={EnrollmentResult}/>
		<Route component={Error404} />
	</Switch>
);

export default Router;