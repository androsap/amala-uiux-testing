import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PromoCriteriaIndex from '../pages/promo_criteria_type/Index';
import PromoCriteriaForm from '../pages/promo_criteria_type/category_type';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <PromoCriteriaIndex menucode="CRITYPE" prefixmenuname="CRITYPE" {...props} />} />
		<Route exact path={match.url + '/category-type/:ID'} render={(props) => (permission !== undefined && (permission["CRITYPE"]["CRITYPE_ACCESS"] )) ? <PromoCriteriaForm menucode="CRITYPE" prefixmenuname="CRITYPE" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;