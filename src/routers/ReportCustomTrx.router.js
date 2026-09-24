import React from 'react';
import { Switch, Route } from 'react-router-dom';
import CustomTrxReport from '../pages/report_custom_trx/Index';
import Error404 from '../pages/error/Error404';

const Router = ({ match }) => (
    <Switch>
        <Route exact path={match.url} render={(props) => <CustomTrxReport menucode="REPCUST" prefixmenuname="REPCUST" {...props} />} />
        <Route component={Error404} />
    </Switch>
);

export default Router;