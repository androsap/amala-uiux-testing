import React from 'react';
import { Switch, Route } from 'react-router-dom';
import AwardListIndex from '../pages/award_list/Index';
import AwardListForm from '../pages/award_list/Form';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <AwardListIndex menucode="AWARD" prefixmenuname="AWARD" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => (permission !== undefined && permission["AWARD"]["AWARD_CREATE"]) ? <AwardListForm menucode="AWARD" prefixmenuname="AWARD" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && (permission["AWARD"]["AWARD_ACCESS"] || permission["AWARD"]["AWARD_UPDATE"])) ? <AwardListForm menucode="AWARD" prefixmenuname="AWARD" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;