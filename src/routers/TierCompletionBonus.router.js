import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Index from '../pages/completion_bonus_tier/Index';
import Form from '../pages/completion_bonus_tier/Form';
import Error404 from '../pages/error/Error404';

const Router = ({match}) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <Index menucode="TIERBON" prefixmenuname="TIERBON" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => <Form menucode="TIERBON" prefixmenuname="TIERBON" {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => <Form menucode="TIERBON" prefixmenuname="TIERBON" {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;