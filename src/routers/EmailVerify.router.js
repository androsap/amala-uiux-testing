import React from 'react';
import { Switch, Route } from 'react-router-dom';
import EmailVerified from '../pages/email_verified';

const Router = ({ match }) => (
	<Switch>
		<Route exact path='/email-verified/:ID' component={EmailVerified} />
	</Switch>
);

export default Router;