import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PartnerGroupIndex from '../pages/partner_group/Index';
import PartnerGroupForm from '../pages/partner_group/Form';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <PartnerGroupIndex menucode="PARTNGRP" prefixmenuname="PARTNGRP" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => (permission !== undefined && permission["PARTNGRP"]["PARTNGRP_CREATE"]) ? <PartnerGroupForm menucode="PARTNGRP" prefixmenuname="PARTNGRP" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && (permission["PARTNGRP"]["PARTNGRP_ACCESS"] || permission["PARTNGRP"]["PARTNGRP_UPDATE"])) ? <PartnerGroupForm menucode="PARTNGRP" prefixmenuname="PARTNGRP" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;