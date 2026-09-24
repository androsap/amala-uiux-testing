import React from 'react';
import { Switch, Route } from 'react-router-dom';
import NonAirAccrualReport from '../pages/report_accrual/NonAir';
import Error404 from '../pages/error/Error404';

const Router = ({ match }) => (
    <Switch>
        <Route exact path={match.url} render={(props) => <NonAirAccrualReport menucode="REPNAAC" prefixmenuname="REPNAAC" {...props} />} />
        <Route component={Error404} />
    </Switch>
);

export default Router;