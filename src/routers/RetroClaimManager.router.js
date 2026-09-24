import React from 'react';
import { Switch, Route } from 'react-router-dom';
import RCManagerIndex from '../pages/rc_manager/Index';
import RCManagerForm from '../pages/rc_manager/Form';
import SkyTeamIn from '../pages/rc_manager/skyteam_in/Index';
import SkyTeamInForm from '../pages/rc_manager/skyteam_in/Form';
import Error404 from '../pages/error/Error404';

const Router = ({ match }) => (
	<Switch>
		<Route exact path={'/retro-claim-ga-manager'} render={(props) => <RCManagerIndex menucode="RETROCL" prefixmenuname="RETROCL" retrofrom="GA" {...props} />} />
		<Route exact path={'/retro-claim-ga-manager/form'} render={(props) => <RCManagerForm menucode="RETROCL" prefixmenuname="RETROCL" retrofrom="GA" {...props} />} />
		<Route exact path={'/retro-claim-ga-manager/form/:ID'} render={(props) => <RCManagerForm menucode="RETROCL" prefixmenuname="RETROCL" retrofrom="GA" {...props} />} />
		<Route exact path={'/retro-claim-ga-manager/form/:ID/approval'} render={(props) => <RCManagerForm formtype="approval" menucode="RETROCL" prefixmenuname="RETROCL" retrofrom="GA" {...props} />} />
		<Route exact path={'/retro-claim-ga-manager/form/:ID/manual-verification'} render={(props) => <RCManagerForm formtype="manual-verification" menucode="RETROCL" prefixmenuname="RETROCL" retrofrom="GA" {...props} />} />

		<Route exact path={'/retro-claim-skyteam-manager'} render={(props) => <RCManagerIndex menucode="RETROCL" prefixmenuname="RETROCL" retrofrom="SKYTEAM" {...props} />} />
		<Route exact path={'/retro-claim-skyteam-manager/form'} render={(props) => <RCManagerForm menucode="RETROCL" prefixmenuname="RETROCL" retrofrom="SKYTEAM" {...props} />} />
		<Route exact path={'/retro-claim-skyteam-manager/form/:ID'} render={(props) => <RCManagerForm menucode="RETROCL" prefixmenuname="RETROCL" retrofrom="SKYTEAM" {...props} />} />
		<Route exact path={'/retro-claim-skyteam-manager/form/:ID/approval'} render={(props) => <RCManagerForm formtype="approval" menucode="RETROCL" prefixmenuname="RETROCL" rofrom="SKYTEAM" {...props} />} />
		<Route exact path={'/retro-claim-skyteam-manager/form/:ID/manual-verification'} render={(props) => <RCManagerForm formtype="manual-verification" menucode="RETROCL" prefixmenuname="RETROCL" retrofrom="SKYTEAM" {...props} />} />
		
		<Route exact path={'/retro-claim-skyteam-in-manager'} render={(props) => <SkyTeamIn menucode="RETROCL" prefixmenuname="RETROCL" {...props} />} />
		<Route exact path={'/retro-claim-skyteam-in-manager/form/:ID'} render={(props) => <SkyTeamInForm menucode="RETROCL" prefixmenuname="RETROCL" {...props} />} />

		<Route exact path={'/retro-claim-staralliance-manager'} render={(props) => <RCManagerIndex menucode="RETROCL" prefixmenuname="RETROCL" retrofrom="STARALLIANCE" {...props} />} />
		<Route exact path={'/retro-claim-staralliance-manager/form'} render={(props) => <RCManagerForm menucode="RETROCL" prefixmenuname="RETROCL" retrofrom="STARALLIANCE" {...props} />} />
		<Route exact path={'/retro-claim-staralliance-manager/form/:ID'} render={(props) => <RCManagerForm menucode="RETROCL" prefixmenuname="RETROCL" retrofrom="STARALLIANCE" {...props} />} />
		<Route exact path={'/retro-claim-staralliance-manager/form/:ID/approval'} render={(props) => <RCManagerForm formtype="approval" menucode="RETROCL" prefixmenuname="RETROCL" retrofrom="STAR ALLIANCE" {...props} />} />
		<Route exact path={'/retro-claim-staralliance-manager/form/:ID/manual-verification'} render={(props) => <RCManagerForm formtype="manual-verification" menucode="RETROCL" prefixmenuname="RETROCL" retrofrom="STARALLIANCE" {...props} />} />
		
		<Route exact path={'/retro-claim-oneworld-manager'} render={(props) => <RCManagerIndex menucode="RETROCL" prefixmenuname="RETROCL" retrofrom="ONEWORLD" {...props} />} />
		<Route exact path={'/retro-claim-oneworld-manager/form'} render={(props) => <RCManagerForm menucode="RETROCL" prefixmenuname="RETROCL" retrofrom="ONEWORLD" {...props} />} />
		<Route exact path={'/retro-claim-oneworld-manager/form/:ID'} render={(props) => <RCManagerForm menucode="RETROCL" prefixmenuname="RETROCL" retrofrom="ONEWORLD" {...props} />} />
		<Route exact path={'/retro-claim-oneworld-manager/form/:ID/approval'} render={(props) => <RCManagerForm formtype="approval" menucode="RETROCL" prefixmenuname="RETROCL" retrofrom="ONEWORLD" {...props} />} />
		<Route exact path={'/retro-claim-oneworld-manager/form/:ID/manual-verification'} render={(props) => <RCManagerForm formtype="manual-verification" menucode="RETROCL" prefixmenuname="RETROCL" retrofrom="ONEWORLD" {...props} />} />
		
		<Route component={Error404} />
	</Switch>
);

export default Router;
