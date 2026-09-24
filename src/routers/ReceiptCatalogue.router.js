import React from 'react';
import { Switch, Route } from 'react-router-dom';
import ReceiptCatalogueIndex from '../pages/receipt_catalogue/Index';
import ReceiptCatalogueForm from '../pages/receipt_catalogue/Form';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <ReceiptCatalogueIndex menucode="RECPCATG" prefixmenuname="RECPCATG" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => (permission !== undefined && permission["RECPCATG"]["RECPCATG_CREATE"]) ? <ReceiptCatalogueForm menucode="RECPCATG" prefixmenuname="RECPCATG" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && (permission["RECPCATG"]["RECPCATG_ACCESS"] || permission["RECPCATG"]["RECPCATG_UPDATE"])) ? <ReceiptCatalogueForm menucode="RECPCATG" prefixmenuname="RECPCATG" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;