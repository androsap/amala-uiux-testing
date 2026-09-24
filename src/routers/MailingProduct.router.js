import React from 'react';
import { Switch, Route } from 'react-router-dom';
import MailingProductIndex from '../pages/mailing_product/catalog/Index';
import MailingProductForm from '../pages/mailing_product/catalog/Form';
import MailingProductCreateForm from '../pages/mailing_product/catalog/basic_info/Form';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <MailingProductIndex menucode="PRMCT" prefixmenuname="PRMCT" {...props} />} />
		<Route exact path={`${match.url}/form`} render={(props) => <MailingProductCreateForm menucode="PRMCT" prefixmenuname="PRMCT" {...props} />} />
		<Route exact path={`${match.url}/form/:ID`} render={(props) => <MailingProductForm menucode="PRMCT" prefixmenuname="PRMCT" {...props} />} />

		<Route exact path={`${match.url}/form/:ID/basic-info`} render={(props) => (permission !== undefined && permission["PRMCT"] && permission["PRMCT"]["PRMCT_UPDATE"]) ? <MailingProductForm menucode="PRMCT" prefixmenuname="PRMCT" menu={'basic-info'} {...props} /> : <Error403 {...props} />} />
		<Route exact path={`${match.url}/form/:ID/cancel-update-fee`} render={(props) => (permission !== undefined && permission["PRMCT"]["PRMCT_UPDATE"]) ? <MailingProductForm menucode="PRMCT" prefixmenuname="PRMCT" menu={'cancel-update-fee'} {...props} /> : <Error403 {...props} />} />
		<Route exact path={`${match.url}/form/:ID/price`} render={(props) => (permission !== undefined && permission["PRMCT"]["PRMCT_UPDATE"]) ? <MailingProductForm menucode="PRMCT" prefixmenuname="PRMCT" menu={'price'} {...props} /> : <Error403 {...props} />} />
		<Route exact path={`${match.url}/form/:ID/vendor`} render={(props) => (permission !== undefined && permission["PRMCT"]["PRMCT_UPDATE"]) ? <MailingProductForm menucode="PRMCT" prefixmenuname="PRMCT" menu={'vendor'} {...props} /> : <Error403 {...props} />} />

		<Route component={Error404} />
	</Switch>
);

export default Router;