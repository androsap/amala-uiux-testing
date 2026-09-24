import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PromoCatalogIndex from '../pages/promo_management/accrual/Index';
import PromoCatalogForm from '../pages/promo_management/accrual/Form';
import PromoCatalogCreateForm from '../pages/promo_management/accrual/basic_info/Form';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <PromoCatalogIndex menucode="PRMANCT" prefixmenuname="PRMANCT" {...props} />} />
		<Route exact path={`${match.url}/form/:ID`} render={(props) => <PromoCatalogForm menucode="PRMANCT" prefixmenuname="PRMANCT" {...props} />} />
		<Route exact path={`${match.url}/form`} render={(props) => <PromoCatalogCreateForm menucode="PRMANCT" prefixmenuname="PRMANCT" {...props} />} />

		<Route exact path={`${match.url}/form/:ID/basic-info`} render={(props) => (permission !== undefined && permission["PRMANCT"] && permission["PRMANCT"]["PRMANCT_UPDATE"]) ? <PromoCatalogForm menucode="PRMANCT" prefixmenuname="PRMANCT" menu={'basic-info'} {...props} /> : <Error403 {...props} />} />
		<Route exact path={`${match.url}/form/:ID/member-criteria`} render={(props) => (permission !== undefined && permission["PRMEMCR"] && permission["PRMEMCR"]["PRMEMCR_ACCESS"] && permission["PRMANCT"]["PRMANCT_UPDATE"]) ? <PromoCatalogForm menucode="PRMEMCR" prefixmenuname="PRMEMCR" menu={'member-criteria'} {...props} /> : <Error403 {...props} />} />
		<Route exact path={`${match.url}/form/:ID/air-criteria`} render={(props) => (permission !== undefined && permission["PRMACR"] && permission["PRMACR"]["PRMACR_ACCESS"] && permission["PRMANCT"]["PRMANCT_UPDATE"]) ? <PromoCatalogForm menucode="PRMEMCR" prefixmenuname="PRMEMCR" menu={'member-criteria'} {...props} /> : <Error403 {...props} />} />
		<Route exact path={`${match.url}/form/:ID/nonair-criteria`} render={(props) => (permission !== undefined && permission["PRMACR"] && permission["PRMACR"]["PRMACR_ACCESS"] && permission["PRMANCT"]["PRMANCT_UPDATE"]) ? <PromoCatalogForm menucode="PRMEMCR" prefixmenuname="PRMEMCR" menu={'member-criteria'} {...props} /> : <Error403 {...props} />} />
		<Route exact path={`${match.url}/form/:ID/bonus-activity`} render={(props) => (permission !== undefined && permission["PRMNBACC"] && permission["PRMNBACC"]["PRMNBACC_ACCESS"] && permission["PRMANCT"]["PRMANCT_UPDATE"]) ? <PromoCatalogForm menucode="PRMEMCR" prefixmenuname="PRMEMCR" menu={'member-criteria'} {...props} /> : <Error403 {...props} />} />
	</Switch>
);

export default Router;