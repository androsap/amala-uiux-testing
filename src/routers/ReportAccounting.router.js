import React from 'react';
import { Switch, Route } from 'react-router-dom';
import AccountingReport from '../pages/report_accounting/Index';
import Error404 from '../pages/error/Error404';

const Router = ({ match }) => (
    <Switch>
        <Route exact path={match.url} render={(props) => <AccountingReport menucode="REPACCT" prefixmenuname="REPACCT" {...props} />} />
        <Route component={Error404} />
    </Switch>
);

export default Router;