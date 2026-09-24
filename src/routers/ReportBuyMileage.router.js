import React from 'react';
import { Switch, Route } from 'react-router-dom';
import BuyMileageReport from '../pages/report_buy_mileage/Index';
import Error404 from '../pages/error/Error404';

const Router = ({ match }) => (
    <Switch>
        <Route exact path={match.url} render={(props) => <BuyMileageReport menucode="REPBUYML" prefixmenuname="REPBUYML" {...props} />} />
        <Route component={Error404} />
    </Switch>
);

export default Router;