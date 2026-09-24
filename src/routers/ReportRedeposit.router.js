import React from 'react';
import { Switch, Route } from 'react-router-dom';
import RedepositReport from '../pages/report_redeposit/Index';
import Error404 from '../pages/error/Error404';

const Router = ({ match }) => (
    <Switch>
        <Route exact path={match.url} render={(props) => <RedepositReport menucode="REPRDP" prefixmenuname="REPRDP" {...props} />} />
        <Route component={Error404} />
    </Switch>
);

export default Router;