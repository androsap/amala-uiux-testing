import React from 'react';
import { Switch, Route } from 'react-router-dom';
import CityPairIndex from '../pages/citypair/Index';
import CityPairForm from '../pages/citypair/Form';
import Error404 from '../pages/error/Error404';

const Router = ({match}) => (
	<Switch>
		<Route exact path={match.url} component={CityPairIndex}/>
		<Route exact path={match.url + '/form'} component={CityPairForm}/>
		<Route exact path={match.url + '/form/:ID'} component={CityPairForm}/>
		<Route component={Error404}/>
	</Switch>
);

export default Router;