import React from 'react';
import { Switch, Route } from 'react-router-dom';
import CobrandReport from '../pages/report_cobrand/Fasttrack';
import Error404 from '../pages/error/Error404';

const Router = ({ match }) => (
    <Switch>
        <Route exact path={match.url} render={(props) => <CobrandReport menucode="REPCBFT" prefixmenuname="REPCBFT" {...props} />} />
        <Route component={Error404} />
    </Switch>
);

export default Router;