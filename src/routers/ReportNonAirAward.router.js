import React from 'react';
import { Switch, Route } from 'react-router-dom';
import NonAirAwardReport from '../pages/report_award/NonAir';
import Error404 from '../pages/error/Error404';

const Router = ({ match }) => (
    <Switch>
        <Route exact path={match.url} render={(props) => <NonAirAwardReport menucode="REPNAAW" prefixmenuname="REPNAAW" {...props} />} />
        <Route component={Error404} />
    </Switch>
);

export default Router;