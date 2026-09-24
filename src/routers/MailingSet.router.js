import React from 'react';
import { Switch, Route } from 'react-router-dom';
import MailingSetIndex from '../pages/mailing_set/Index';
import MailingSetForm from '../pages/mailing_set/Form';
import MailingForm from '../pages/mailing_set/mailing/Form';
import MailingItemForm from '../pages/mailing_set/mailing_item/Form';
import MailingItemIndex from '../pages/mailing_set/mailing_item/Index';
import Error404 from '../pages/error/Error404';

const Router = ({match}) => (
	<Switch>
		<Route exact path={match.url} component={MailingSetIndex}/>
		<Route exact path={match.url + '/form'} component={MailingSetForm}/>
		<Route exact path={match.url + '/form/:ID'} component={MailingSetForm}/>
		<Route exact path={match.url + '/mailing'} component={MailingForm}/>
		<Route exact path={match.url + '/mailing-item'} component={MailingItemIndex}/>
		<Route exact path={match.url + '/mailing-item/form'} component={MailingItemForm}/>
		<Route exact path={match.url + '/mailing-item/form/:ID'} component={MailingItemForm}/>
		<Route component={Error404}/>
	</Switch>
);

export default Router;