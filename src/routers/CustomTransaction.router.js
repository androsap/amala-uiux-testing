import React from 'react';
import { Switch, Route } from 'react-router-dom';
import CustomTransactionIndex from '../pages/custom_transaction/Index';
import CustomTransactionForm from '../pages/custom_transaction/Form';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <CustomTransactionIndex menucode="CUSTTRAN" prefixmenuname="CUSTTRAN" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => (permission !== undefined && permission["CUSTTRAN"]["CUSTTRAN_CREATE"]) ? <CustomTransactionForm menucode="CUSTTRAN" prefixmenuname="CUSTTRAN" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && (permission["CUSTTRAN"]["CUSTTRAN_ACCESS"] || permission["CUSTTRAN"]["CUSTTRAN_UPDATE"])) ? <CustomTransactionForm menucode="CUSTTRAN" prefixmenuname="CUSTTRAN" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;