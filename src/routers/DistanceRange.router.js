import React from 'react';
import { Switch, Route } from 'react-router-dom';
import DistanceRangeIndex from '../pages/distance_range/Index';
import DistanceRangeForm from '../pages/distance_range/Form';
import Error404 from '../pages/error/Error404';

const Router = ({ match }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <DistanceRangeIndex menucode="DSTRANGE" prefixmenuname="DSTRANGE" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => <DistanceRangeForm menucode="DSTRANGE" prefixmenuname="DSTRANGE" {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => <DistanceRangeForm menucode="DSTRANGE" prefixmenuname="DSTRANGE" {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;