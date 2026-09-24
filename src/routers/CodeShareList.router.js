import React from 'react';
import { Switch, Route } from 'react-router-dom';
import CodeShareListIndex from '../pages/codeshare_list/Index';
import CodeshareListForm from '../pages/codeshare_list/Form';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <CodeShareListIndex menucode="CDESHAR" prefixmenuname="CDESHAR" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => (permission !== undefined && permission["CDESHAR"]["CDESHAR_CREATE"]) ? <CodeshareListForm menucode="CDESHAR" prefixmenuname="CDESHAR" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && (permission["CDESHAR"]["CDESHAR_ACCESS"] || permission["CDESHAR"]["CDESHAR_UPDATE"])) ? <CodeshareListForm menucode="CDESHAR" prefixmenuname="CDESHAR" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;