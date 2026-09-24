import React from 'react';
import { Switch, Route } from 'react-router-dom';
import RelationBonusIndex from '../pages/relation_bonus/Index';
import RelationBonusForm from '../pages/relation_bonus/Form';
import Error404 from '../pages/error/Error404';

const Router = ({ match }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <RelationBonusIndex menucode="TIERMRELBONUS" prefixmenuname="RELBONUS" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => <RelationBonusForm menucode="TIERMRELBONUS" prefixmenuname="RELBONUS" {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => <RelationBonusForm menucode="TIERMRELBONUS" prefixmenuname="RELBONUS" {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;