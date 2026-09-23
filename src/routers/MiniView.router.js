import React from 'react';
import { Switch, Route } from 'react-router-dom';
import MiniView from '../pages/mini_view/Index';

const Router = ({match}) => (
	<Switch>
		<Route exact path='/mini-view' component={MiniView} />
	</Switch>
);

export default Router;