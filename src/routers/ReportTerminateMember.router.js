import React from 'react';
import { Switch, Route } from 'react-router-dom';
import TerminateMemberReport from '../pages/report_terminate_member/Index';
import Error404 from '../pages/error/Error404';

const Router = ({ match }) => (
    <Switch>
        <Route exact path={match.url} render={(props) => <TerminateMemberReport menucode="REPTMT" prefixmenuname="REPTMT" {...props} />} />
        <Route component={Error404} />
    </Switch>
);

export default Router;