import React from 'react';
import { Switch, Route } from 'react-router-dom';
import LoginIndex from '../pages/login/Index';
import Activation from '../pages/activation/Index';
import ResetPasswordMember from '../pages/member/reset_password/Form';
import ResetPassword from '../pages/user/ResetPassword';
import EmailVerified from '../pages/email_verified';

const Router = ({ match }) => (
	<Switch>
		<Route exact path='/email-verified/:ID' component={EmailVerified} />
		<Route exact path='/activation' component={Activation} />
		<Route exact path='/activation/:ID' component={Activation} />
		<Route exact path='/announcement/reset-password-member/0PmbPX88cCzQydIqCBxOWP08b=' component={ResetPasswordMember} />
		<Route exact path='/reset-password-member/:ID' component={ResetPasswordMember} />
		{/* <Route exact path='/reset-password' component={ResetPassword} /> */}
		<Route exact path='/reset-password/:ID' component={ResetPassword} />
		<Route component={LoginIndex} />
	</Switch>
);

export default Router;