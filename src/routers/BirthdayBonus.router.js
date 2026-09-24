import React from 'react';
import { Switch, Route } from 'react-router-dom';
import BirthdayBonusIndex from '../pages/birthday_bonus/Index';
import BirthdayBonusForm from '../pages/birthday_bonus/Form';
import Error404 from '../pages/error/Error404';

const Router = ({match}) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <BirthdayBonusIndex menucode="BDAYBON" prefixmenuname="BDAYBON" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => <BirthdayBonusForm menucode="BDAYBON" prefixmenuname="BDAYBON" {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => <BirthdayBonusForm menucode="BDAYBON" prefixmenuname="BDAYBON" {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;