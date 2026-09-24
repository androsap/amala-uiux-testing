import React from 'react';
import { Switch, Route } from 'react-router-dom';
import EnrollBonusIndex from '../pages/enroll_bonus/Index';
import EnrollBonusForm from '../pages/enroll_bonus/Form';
import Error404 from '../pages/error/Error404';

const Router = ({match}) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <EnrollBonusIndex menucode="TIERMENRBONUS" prefixmenuname="ENBONUS" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => <EnrollBonusForm menucode="TIERMENRBONUS" prefixmenuname="ENBONUS" {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => <EnrollBonusForm menucode="TIERMENRBONUS" prefixmenuname="ENBONUS" {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;