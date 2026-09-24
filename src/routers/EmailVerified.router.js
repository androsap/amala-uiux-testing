import React from 'react';
import { Switch, Route } from 'react-router-dom';
import EmailVerified from '../pages/email_verified';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url + '/:ID'} render={(props) => <EmailVerified  {...props} />} />
	</Switch>
);

export default Router;