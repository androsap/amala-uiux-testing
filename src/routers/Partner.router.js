import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PartnerIndex from '../pages/partner/Index';
import PartnerForm from '../pages/partner/Form';
import PartnerCobrandIndex from '../pages/partner/cobrand/Index';
import PartnerCobrandForm from '../pages/partner/cobrand/Form';
import PartnerBulkIndex from '../pages/partner/bulk/Index';
// import PartnerBulkDetail from '../pages/partner/bulk/Detail';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <PartnerIndex menucode="PARTNER" prefixmenuname="PARTNER" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => (permission !== undefined && permission["PARTNER"]["PARTNER_CREATE"]) ? <PartnerForm menucode="PARTNER" prefixmenuname="PARTNER" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && (permission["PARTNER"]["PARTNER_ACCESS"] || permission["PARTNER"]["PARTNER_UPDATE"])) ? <PartnerForm menucode="PARTNER" prefixmenuname="PARTNER" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/cobrand'} render={(props) => (permission !== undefined && permission["PARTCOBR"]["PARTCOBR_CREATE"]) ? <PartnerCobrandIndex menucode="PARTCOBR" prefixmenuname="PARTCOBR" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/cobrand/form'} render={(props) => (permission !== undefined && permission["PARTCOBR"]["PARTCOBR_CREATE"]) ? <PartnerCobrandForm menucode="PARTCOBR" prefixmenuname="PARTCOBR" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/cobrand/form/:ID'} render={(props) => (permission !== undefined && (permission["PARTCOBR"]["PARTCOBR_ACCESS"] || permission["PARTCOBR"]["PARTCOBR_UPDATE"])) ? <PartnerCobrandForm menucode="PARTCOBR" prefixmenuname="PARTCOBR" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/bulk'} render={(props) => (permission !== undefined && permission["PARTBULK"]["PARTBULK_ACCESS"]) ? <PartnerBulkIndex menucode="PARTBULK" prefixmenuname="PARTBULK" {...props} /> : <Error403 {...props} />} />
		{/* <Route exact path={match.url + '/bulk/form/:ID'} render={(props) => (permission !== undefined && (permission["PARTBULK"]["PARTBULK_ACCESS"])) ? <PartnerBulkDetail menucode="PARTBULK" prefixmenuname="PARTBULK" {...props} /> : <Error403 {...props} />} /> */}
		<Route component={Error404} />
	</Switch>
);

export default Router;