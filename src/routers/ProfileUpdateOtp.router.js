import React from 'react';
import { Switch, Route } from 'react-router-dom';
import ProfileUpdateOtp from '../pages/member/profile-otp/index';

const Router = () => (
	<Switch>
		<Route
			exact path="/otp/verification/:otpkey" render={(props) => { const { otpkey } = props.match.params; return <ProfileUpdateOtp {...props} /> }} />
	</Switch>
);

export default Router;