import React from 'react';
import { Switch, Route } from 'react-router-dom';
import RedemptionIndex from '../pages/approval/redemption/Index';
import RedemptionForm from '../pages/approval/redemption/Form';
import RedemptionCancelIndex from '../pages/approval/redemption/Index';
import RedemptionCancelForm from '../pages/approval/redemption/Form';
import RedemptionUpdateIndex from '../pages/approval/redemption/Index';
import RedemptionUpdateForm from '../pages/approval/redemption/Form';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path='/approval-redemption' render={(props) => <RedemptionIndex menucode="APPRRED" prefixmenuname="APPRRED" {...props} />} />
		<Route exact path='/approval-redemption/form/:ID' render={(props) => (permission !== undefined && (permission["APPRRED"]["APPRRED_ACCESS"] || permission["APPRRED"]["APPRRED_UPDATE"])) ?
			<RedemptionForm menucode="APPRRED" prefixmenuname="APPRRED" {...props} /> : <Error403 {...props} />} />

		<Route exact path='/approval-redemption-cancel' render={(props) => <RedemptionCancelIndex pagetype="cancel" menucode="APPRCAN" prefixmenuname="APPRCAN" {...props} />} />
		<Route exact path='/approval-redemption-cancel/form/:ID' render={(props) => (permission !== undefined && (permission["APPRCAN"]["APPRCAN_ACCESS"] || permission["APPRCAN"]["APPRCAN_UPDATE"])) ?
			<RedemptionCancelForm pagetype="cancel" menucode="APPRCAN" prefixmenuname="APPRCAN" {...props} /> : <Error403 {...props} />} />

		<Route exact path='/approval-redemption-update' render={(props) => <RedemptionUpdateIndex pagetype="update" menucode="APPRUPD" prefixmenuname="APPRUPD" {...props} />} />
		<Route exact path='/approval-redemption-update/form/:ID' render={(props) => (permission !== undefined && (permission["APPRUPD"]["APPRUPD_ACCESS"] || permission["APPRUPD"]["APPRUPD_UPDATE"])) ?
			<RedemptionUpdateForm pagetype="update" menucode="APPRUPD" prefixmenuname="APPRUPD" {...props} /> : <Error403 {...props} />} />

		<Route component={Error404} />
	</Switch>

);

export default Router;
