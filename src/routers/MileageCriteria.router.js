import React from 'react';
import { Switch, Route } from 'react-router-dom';
import MileageCriteriaIndex from '../pages/mileage_criteria/Index';
import MileageCriteriaForm from '../pages/mileage_criteria/Form';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <MileageCriteriaIndex menucode="TIERMMILCRITE" prefixmenuname="MILCRITE" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => (permission !== undefined && permission["TIERMMILCRITE"]["MILCRITE_CREATE"]) ? <MileageCriteriaForm menucode="TIERMMILCRITE" prefixmenuname="MILCRITE" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && (permission["TIERMMILCRITE"]["MILCRITE_ACCESS"] || permission["TIERMMILCRITE"]["MILCRITE_UPDATE"])) ? <MileageCriteriaForm menucode="TIERMMILCRITE" prefixmenuname="MILCRITE" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;