import React from 'react';
import { Switch, Route } from 'react-router-dom';
import NewsIndex from '../pages/news/Index';
import NewsDetail from '../pages/news/Detail';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <NewsIndex menucode="NEWS" prefixmenuname="NEWS" {...props} />} />
		<Route exact path={match.url + '/:ID'} render={(props) => (permission !== undefined && (permission["NEWS"]["NEWS_ACCESS"])) ? <NewsDetail menucode="NEWS" prefixmenuname="NEWS" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

// const Router = ({ match }) => (
// 	<Switch>
// 		<Route exact path={match.url} render={<NewsIndex />} />
// 		<Route exact path={match.url + '/:ID'} render={<NewsDetail />} />
// 		<Route component={Error404} />
// 	</Switch>
// );

export default Router;