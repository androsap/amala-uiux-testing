import React from 'react';
import { Switch, Route } from 'react-router-dom';
import AirAwardReport from '../pages/report_award/Air';
import Error404 from '../pages/error/Error404';

const Router = ({ match }) => (
    <Switch>
        <Route exact path={match.url} render={(props) => <AirAwardReport menucode="REPARAW" prefixmenuname="REPARAW" {...props} />} />
        <Route component={Error404} />
    </Switch>
);

export default Router;