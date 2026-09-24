import React from 'react';
import { Switch, Route } from 'react-router-dom';
import SuspectDuplicateIndex from '../pages/suspect_duplicate/Index';
import SuspectDuplicateDetail from  '../pages/suspect_duplicate/Details';
import Error404 from '../pages/error/Error404';

const Router = ({ match }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <SuspectDuplicateIndex menucode="SUSPDUP" prefixmenuname="SUSPDUP" {...props} />} />
		<Route exact path='/suspect-duplicate/:ID' render={(props) => <SuspectDuplicateDetail menucode="SUSPDUP" prefixmenuname="SUSPDUP" {...props} />}/>
		<Route component={Error404} />
	</Switch>
);

export default Router;