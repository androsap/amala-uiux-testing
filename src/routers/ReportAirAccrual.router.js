import React from 'react';
import { Switch, Route } from 'react-router-dom';
import AirAccrualReport from '../pages/report_accrual/Air';
import Error404 from '../pages/error/Error404';

const Router = ({ match }) => (
    <Switch>
        <Route exact path={match.url} render={(props) => <AirAccrualReport menucode="REPARAC" prefixmenuname="REPARAC" {...props} />} />
        <Route component={Error404} />
    </Switch>
);

export default Router;