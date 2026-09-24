import React from 'react';
import { Switch, Route } from 'react-router-dom';
import MemberProfileReport from '../pages/report_member_profile/Index';
import Error404 from '../pages/error/Error404';

const Router = ({ match }) => (
    <Switch>
        <Route exact path={match.url} render={(props) => <MemberProfileReport menucode="REPMMBR" prefixmenuname="REPMMBR" {...props} />} />
        <Route component={Error404} />
    </Switch>
);

export default Router;