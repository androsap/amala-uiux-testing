import React from 'react';
import { Switch, Route } from 'react-router-dom';
import AirlineIndex from '../pages/airline/Index';
import AirlineForm from '../pages/airline/Form';
import AirlineScheduleIndex from '../pages/airline/flight_schedule/Index';
import AirlineScheduleForm from '../pages/airline/flight_schedule/Form';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';

const Router = ({ match, permission }) => (
	<Switch>
		<Route exact path={match.url} render={(props) => <AirlineIndex menucode="AIRLINE" prefixmenuname="AIRLINE" {...props} />} />
		<Route exact path={match.url + '/form'} render={(props) => (permission !== undefined && permission["AIRLINE"]["AIRLINE_CREATE"]) ? <AirlineForm menucode="AIRLINE" prefixmenuname="AIRLINE" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/form/:ID'} render={(props) => (permission !== undefined && (permission["AIRLINE"]["AIRLINE_ACCESS"] || permission["AIRLINE"]["AIRLINE_UPDATE"])) ? <AirlineForm menucode="AIRLINE" prefixmenuname="AIRLINE" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/schedule'} render={(props) => (permission !== undefined && permission["FLIGSCHE"]["FLIGSCHE_CREATE"]) ? <AirlineScheduleIndex menucode="FLIGSCHE" prefixmenuname="FLIGSCHE" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/schedule/form'} render={(props) => (permission !== undefined && permission["FLIGSCHE"]["FLIGSCHE_CREATE"]) ? <AirlineScheduleForm menucode="FLIGSCHE" prefixmenuname="FLIGSCHE" {...props} /> : <Error403 {...props} />} />
		<Route exact path={match.url + '/schedule/form/:ID'} render={(props) => (permission !== undefined && (permission["FLIGSCHE"]["FLIGSCHE_ACCESS"] || permission["FLIGSCHE"]["FLIGSCHE_UPDATE"])) ? <AirlineScheduleForm menucode="FLIGSCHE" prefixmenuname="FLIGSCHE" {...props} /> : <Error403 {...props} />} />
		<Route component={Error404} />
	</Switch>
);

export default Router;