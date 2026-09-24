import React from 'react';
import { Switch, Route } from 'react-router-dom';
import TitleIndex from '../pages/title/Index';
import TitleForm from '../pages/title/Form';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <TitleIndex menucode="MSDTTITLE" prefixmenuname="TITLE" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => (permission !== undefined && permission["MSDTTITLE"]["TITLE_CREATE"]) ? <TitleForm menucode="MSDTTITLE" prefixmenuname="TITLE" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && (permission["MSDTTITLE"]["TITLE_ACCESS"] || permission["MSDTTITLE"]["TITLE_UPDATE"])) ? <TitleForm menucode="MSDTTITLE" prefixmenuname="TITLE" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;