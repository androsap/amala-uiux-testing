import React from 'react';
import { Switch, Route } from 'react-router-dom';
import MileageStatementLog from '../pages/mileage_statement_log/Index';
import Error404 from '../pages/error/Error404';

const Router = ({ match }) => (
    <Switch>
        <Route exact path={match.url} render={(props) => <MileageStatementLog menucode="MISTLOG" prefixmenuname="MISTLOG" {...props} />} />
        <Route component={Error404} />
    </Switch>
);

export default Router;