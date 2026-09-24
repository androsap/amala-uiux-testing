import React from 'react';
import { Switch, Route } from 'react-router-dom';
import MergingConfirmation from '../pages/merging_account/Confirmation';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={'/merging/:mergeid'} render={(props) => <MergingConfirmation {...props} />} />
	</Switch>
);

export default Router;