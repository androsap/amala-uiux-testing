import React from 'react';
import { Switch, Route } from 'react-router-dom';
import CardInventoryIndex from '../pages/card_inventory/Index';
import CardInventoryForm from '../pages/card_inventory/Form';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <CardInventoryIndex menucode="CARDINVE" prefixmenuname="CARDINVE" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => (permission !== undefined && permission["CARDINVE"]["CARDINVE_CREATE"]) ? <CardInventoryForm menucode="CARDINVE" prefixmenuname="CARDINVE" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && (permission["CARDINVE"]["CARDINVE_ACCESS"] || permission["CARDINVE"]["CARDINVE_UPDATE"])) ? <CardInventoryForm menucode="CARDINVE" prefixmenuname="CARDINVE" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>


);

export default Router;