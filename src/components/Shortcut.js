import React from 'react';
import { Link } from 'react-router-dom';

const Shortcut = () => (
	<aside className="right-side">
		<div className="aside-title">
			<button type="button" className="btn btn-shortcut-close">
				<i className="mdi mdi-close"></i>
			</button>
			<h3>Admin Shortcut</h3>
			<p>You can use this quick tools</p>
		</div>
		<div className="quick-box">
			<Link to={"/"} className="btn btn-quick">
				<i className="mdi mdi-home"></i> Dashboard
			</Link>
			<Link to={"/country"} className="btn btn-quick">
				<i className="mdi mdi-globe-model"></i> Country
			</Link>
			<Link to={"/state"} className="btn btn-quick">
				<i className="mdi mdi-office"></i> State
			</Link>
			<Link to={"/city"} className="btn btn-quick">
				<i className="mdi mdi-city"></i> City
			</Link>
			<Link to={"/airport"} className="btn btn-quick">
				<i className="mdi mdi-airplane-landing"></i> Airport
			</Link>
			<Link to={"/title"} className="btn btn-quick">
				<i className="mdi mdi-format-title"></i> Title
			</Link>
			<Link to={"/salutation"} className="btn btn-quick">
				<i className="mdi mdi-nature-people"></i> Salutation
			</Link>
			<Link to={"/language"} className="btn btn-quick">
				<i className="mdi mdi-nature"></i> Language
			</Link>
		</div>
	</aside>
);

export default Shortcut;