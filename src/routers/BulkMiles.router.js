import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PartnerIndex from '../pages/bulk_miles/Index';
import BulkMilesIndex from '../pages/bulk_miles/bulk/Index';
import BulkMilesDetail from '../pages/bulk_miles/bulk/Detail';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <PartnerIndex menucode="PARTBULK" prefixmenuname="PARTBULK" {...props} />} />
		<Route exact path={match.url + '/bulk'} render={(props) => (permission !== undefined && permission["PARTBULK"]["PARTBULK_ACCESS"]) ? <BulkMilesIndex menucode="PARTBULK" prefixmenuname="PARTBULK" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/bulk/form/:ID'} render={(props) => (permission !== undefined && (permission["PARTBULK"]["PARTBULK_ACCESS"])) ? <BulkMilesDetail menucode="PARTBULK" prefixmenuname="PARTBULK" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;