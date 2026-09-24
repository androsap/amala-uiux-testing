import React from 'react';
import { Switch, Route } from 'react-router-dom';
import RCApprovalIndex from '../pages/rc_approval/Index';
import RCManagerForm from '../pages/rc_manager/Form';
import RCApprovalForm from '../pages/rc_manager/Approval';
import Error404 from '../pages/error/Error404';

const Router = ({ match }) => (
	<Switch>
		<Route exact path={'/retro-claim-ga-approval'} render={(props) => <RCApprovalIndex menucode="RETCAPR" prefixmenuname="RETCAPR" retrofrom="GA" {...props} />} />
		<Route exact path={'/retro-claim-ga-approval/form'} render={(props) => <RCManagerForm menucode="RETCAPR" prefixmenuname="RETCAPR" retrofrom="GA" {...props} />} />
		<Route exact path={'/retro-claim-ga-approval/form/:ID'} render={(props) => <RCManagerForm menucode="RETCAPR" prefixmenuname="RETCAPR" retrofrom="GA" {...props} />} />
		<Route exact path={'/retro-claim-ga-approval/form/:ID/approval'} render={(props) => <RCApprovalForm formtype="approval" menucode="RETCAPR" prefixmenuname="RETCAPR" retrofrom="GA" {...props} />} />

		<Route exact path={'/retro-claim-skyteam-approval'} render={(props) => <RCApprovalIndex menucode="RETCAPR" prefixmenuname="RETCAPR" retrofrom="SKYTEAM" {...props} />} />
		<Route exact path={'/retro-claim-skyteam-approval/form'} render={(props) => <RCManagerForm menucode="RETCAPR" prefixmenuname="RETCAPR" retrofrom="SKYTEAM" {...props} />} />
		<Route exact path={'/retro-claim-skyteam-approval/form/:ID'} render={(props) => <RCManagerForm menucode="RETCAPR" prefixmenuname="RETCAPR" retrofrom="SKYTEAM" {...props} />} />
		<Route exact path={'/retro-claim-skyteam-approval/form/:ID/approval'} render={(props) => <RCApprovalForm formtype="approval" menucode="RETCAPR" prefixmenuname="RETCAPR" retrofrom="SKYTEAM" {...props} />} />

		<Route exact path={'/retro-claim-staralliance-approval'} render={(props) => <RCApprovalIndex menucode="RETCAPR" prefixmenuname="RETCAPR" retrofrom="STARALLIANCE" {...props} />} />
		<Route exact path={'/retro-claim-staralliance-approval/form'} render={(props) => <RCManagerForm menucode="RETCAPR" prefixmenuname="RETCAPR" retrofrom="STARALLIANCE" {...props} />} />
		<Route exact path={'/retro-claim-staralliance-approval/form/:ID'} render={(props) => <RCManagerForm menucode="RETCAPR" prefixmenuname="RETCAPR" retrofrom="STARALLIANCE" {...props} />} />
		<Route exact path={'/retro-claim-staralliance-approval/form/:ID/approval'} render={(props) => <RCApprovalForm formtype="approval" menucode="RETCAPR" prefixmenuname="RETCAPR" retrofrom="STAR ALLIANCE" {...props} />} />

		<Route exact path={'/retro-claim-oneworld-approval'} render={(props) => <RCApprovalIndex menucode="RETROCL" prefixmenuname="RETROCL" retrofrom="ONEWORLD" {...props} />} />
		<Route exact path={'/retro-claim-oneworld-approval/form'} render={(props) => <RCManagerForm menucode="RETCAPR" prefixmenuname="RETCAPR" retrofrom="ONEWORLD" {...props} />} />
		<Route exact path={'/retro-claim-oneworld-approval/form/:ID'} render={(props) => <RCManagerForm menucode="RETCAPR" prefixmenuname="RETCAPR" retrofrom="ONEWORLD" {...props} />} />
		<Route exact path={'/retro-claim-oneworld-approval/form/:ID/approval'} render={(props) => <RCApprovalForm formtype="approval" menucode="RETCAPR" prefixmenuname="RETCAPR" retrofrom="ONEWORLD" {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;