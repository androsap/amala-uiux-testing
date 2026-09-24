import React from 'react';
import { Switch, Route } from 'react-router-dom';
import DownloadReport from '../pages/report_download/Index';
import Error404 from '../pages/error/Error404';

const Router = ({ match }) => (
    <Switch>
        <Route exact path={match.url} render={(props) => <DownloadReport menucode="REPDOWN" prefixmenuname="REPDOWN" {...props} />} />
        <Route component={Error404} />
    </Switch>
);

export default Router;