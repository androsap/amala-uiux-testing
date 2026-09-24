import React from 'react';
import { Switch, Route } from 'react-router-dom';
import NomineeVerification from '../pages/member/nominee/Verification';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={'/nominee/confirmation/:redemptionnomineecode'} render={(props) => <NomineeVerification {...props} />} />
	</Switch>
);

export default Router;