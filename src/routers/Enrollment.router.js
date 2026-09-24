import React from 'react';
import { Switch, Route } from 'react-router-dom';
import EnrollmentIndex from '../pages/enrollment/Index';
import EnrollmentCreate from '../pages/enrollment/Create';
import EnrollmentResult from '../pages/enrollment/Result';
import Error404 from '../pages/error/Error404';

const Router = ({match}) => (
	<Switch>
		<Route exact path={match.url} component={EnrollmentIndex}/>
		<Route path={match.url + '/create/:ID'} component={EnrollmentCreate}/>
		<Route exact path={match.url + '/result'} component={EnrollmentResult}/>
		<Route component={Error404}/>
	</Switch>
);

export default Router;