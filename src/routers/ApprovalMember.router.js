import React from 'react';
import { Switch, Route } from 'react-router-dom';

import BuyMileageIndex from '../pages/approval/member/buy_mileage/Index';
import BuyMileageForm from '../pages/approval/member/buy_mileage/Form.js';

import RedemptionIndex from '../pages/approval/member/redemption/Index';
import RedemptionForm from '../pages/approval/member/redemption/Form';

import RedemptionCancelIndex from '../pages/approval/member/redemption/Index';
import RedemptionCancelForm from '../pages/approval/member/redemption/Form';

import RedemptionUpdateIndex from '../pages/approval/member/redemption/Index';
import RedemptionUpdateForm from '../pages/approval/member/redemption/Form';

import MyApprovalIndex from '../pages/my_approval/Index';
import MyApprovalView from '../pages/my_approval/View';

import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
    <Switch>
        <Route exact path='/approval-buy-mileage' render={(props) => <BuyMileageIndex menucode="APPRBML" prefixmenuname="APPRBML" {...props} />} />
        <Route exact path='/approval-buy-mileage/form/:ID' render={(props) => (permission !== undefined && (permission["APPRBML"]["APPRBML_ACCESS"] || permission["APPRBML"]["APPRBML_UPDATE"])) ?
            <BuyMileageForm menucode="APPRBML" prefixmenuname="APPRBML" {...props} /> : <Error403 {...props} />} />

        <Route exact path='/approval-redemption' render={(props) => <RedemptionIndex menucode="APPRRED" prefixmenuname="APPRRED" {...props} />} />
        <Route exact path='/approval-redemption/form/:ID' render={(props) => (permission !== undefined && (permission["APPRRED"]["APPRRED_ACCESS"] || permission["APPRRED"]["APPRRED_UPDATE"])) ?
            <RedemptionForm menucode="APPRRED" prefixmenuname="APPRRED" {...props} /> : <Error403 {...props} />} />

        <Route exact path='/approval-redemption-cancel' render={(props) => <RedemptionCancelIndex pagetype="cancel" menucode="APPRCAN" prefixmenuname="APPRCAN" {...props} />} />
        <Route exact path='/approval-redemption-cancel/form/:ID' render={(props) => (permission !== undefined && (permission["APPRCAN"]["APPRCAN_ACCESS"] || permission["APPRCAN"]["APPRCAN_UPDATE"])) ?
            <RedemptionCancelForm pagetype="cancel" menucode="APPRCAN" prefixmenuname="APPRCAN" {...props} /> : <Error403 {...props} />} />

        <Route exact path='/approval-redemption-update' render={(props) => <RedemptionUpdateIndex pagetype="update" menucode="APPRUPD" prefixmenuname="APPRUPD" {...props} />} />
        <Route exact path='/approval-redemption-update/form/:ID' render={(props) => (permission !== undefined && (permission["APPRUPD"]["APPRUPD_ACCESS"] || permission["APPRUPD"]["APPRUPD_UPDATE"])) ?
            <RedemptionUpdateForm pagetype="update" menucode="APPRUPD" prefixmenuname="APPRUPD" {...props} /> : <Error403 {...props} />} />

        <Route exact path='/my-approval' render={(props) => <MyApprovalIndex menucode="MYAPPR" prefixmenuname="MYAPPR" {...props} />} />
        <Route exact path='/my-approval/form/:ID' render={(props) => (permission !== undefined && permission["MYAPPR"]["MYAPPR_UPDATE"]) ?
            <MyApprovalView menucode="MYAPPR" prefixmenuname="MYAPPR" type="UPDATE" {...props} /> : <Error403 {...props} />} />

        <Route component={Error404} />
    </Switch>
);

export default Router;
