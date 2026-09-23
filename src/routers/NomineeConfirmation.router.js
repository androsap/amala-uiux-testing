import React from 'react';
import { Switch, Route } from 'react-router-dom';
import NomineeVerification from '../pages/member/nominee';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={'/nominee/confirmation/:token/a/:type'} render={(props) => <NomineeVerification {...props} />} />
	</Switch>
);

export default Router;