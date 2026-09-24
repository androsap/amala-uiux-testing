import React from 'react';
import { Switch, Route } from 'react-router-dom';
import HobbiesIndex from '../pages/hobbies/Index';
import HobbiesForm from '../pages/hobbies/Form';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <HobbiesIndex menucode="MSDTHOBBIES" prefixmenuname="HOBBIES" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => (permission !== undefined && permission["MSDTHOBBIES"]["HOBBIES_CREATE"]) ? <HobbiesForm menucode="MSDTHOBBIES" prefixmenuname="HOBBIES" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && (permission["MSDTHOBBIES"]["HOBBIES_ACCESS"] || permission["MSDTHOBBIES"]["HOBBIES_UPDATE"])) ? <HobbiesForm menucode="MSDTHOBBIES" prefixmenuname="HOBBIES" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;