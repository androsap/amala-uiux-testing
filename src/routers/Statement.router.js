import React from 'react';
import { Switch, Route } from 'react-router-dom';
import StatementIndex from '../pages/statement/Index';
import StatementForm from '../pages/statement/Form';
import TemplateTextIndex from '../pages/statement/templatetext/Index';
import TemplateTextForm from '../pages/statement/templatetext/Form';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <StatementIndex menucode="STATMENT" prefixmenuname="STATMENT" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => (permission !== undefined && permission["STATMENT"]["STATMENT_CREATE"]) ? <StatementForm menucode="STATMENT" prefixmenuname="STATMENT" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && (permission["STATMENT"]["STATMENT_ACCESS"] || permission["STATMENT"]["STATMENT_UPDATE"])) ? <StatementForm menucode="STATMENT" prefixmenuname="STATMENT" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/template-text/'} render={(props) => (permission !== undefined && permission["STATTEXT"]["STATTEXT_ACCESS"]) ? <TemplateTextIndex menucode="STATTEXT" prefixmenuname="STATTEXT" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/template-text/form'} render={(props) => (permission !== undefined && permission["STATTEXT"]["STATTEXT_CREATE"]) ? <TemplateTextForm menucode="STATTEXT" prefixmenuname="STATTEXT" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/template-text/form/:ID'} render={(props) => (permission !== undefined && (permission["STATTEXT"]["STATTEXT_ACCESS"] || permission["STATTEXT"]["STATTEXT_UPDATE"])) ? <TemplateTextForm menucode="STATTEXT" prefixmenuname="STATTEXT" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;