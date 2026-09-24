import React, { Component } from 'react';
import Alert from '../../components/Alert';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';
import Loader from '../../components/Loader';

export default class Step1 extends Component {
	constructor(props) {
		super(props);
		this.state = {
			errors: {},
			loading: false,
			hobbiesList: [],
			hobbies: props.enrollment.hobbies,
			hobbiesDetail: [],
			checkedItems: new Map(),
		};
	}

	componentDidMount() {
		this.getOptionsHobbies();

		var hobbiesDetail = [];
		for (const field in this.state.hobbies) {
			// hobbiesDetail["hobbies" + this.state.hobbies[field]['hobbiesid']] = true;
			hobbiesDetail["hobbies" + this.state.hobbies[field]] = true;
		}
		this.setState({ hobbiesDetail })
	}

	getOptionsHobbies() {
		let paging = {
			limit: -1,
			page: 1
		}
		let sort = {
			hobbiesname: 'asc'
		};
		let criteria = {
			active: true
		};
		let url = api.url.hobbies.list;
		let column = [];
		var result = RetrieveRequest(url, paging, column, criteria, sort);
		result.then((response) => {
			const { status, result } = response;
			if (status.responsecode.substring(0, 1) === '0') {
				this.setState({
					hobbiesList: result
				});
			} else {
				Alert.error(status.responsemessage);
			}
		});
	}

	_grabUserInput() {
		//mapping member hobbies
		const formData = {};
		var key = 0;
		var hobbies = [];
		for (const field in this.refs) {
			formData[field] = this.refs[field].checked;
			if (formData[field] === true) {
				hobbies[key] = [];
				hobbies[key] = field.split("_")[1];
				key++;
			}
		}

		return { hobbies };
	}

	isValidated = () => {
		let errors = {};
		let status = true;
		const userInput = this._grabUserInput();

		if (userInput.hobbies.length === 0) {
			errors['hobbies'] = 'Please choose one hobby';
		}

		this.props.updateStore({
			...userInput
		});

		if (Object.getOwnPropertyNames(errors).length > 0) {
			status = false;
		}

		this.setState({ errors: errors });

		return status;
	}

	handleHobbiesChange = () => {
		//mapping member hobbies
		const formData = {};
		var key = 0;
		var hobbies = [];
		for (const field in this.refs) {
			formData[field] = this.refs[field].checked;
			if (formData[field] === true) {
				hobbies[key] = field.split("_")[1];
				// hobbies[key] = {};
				// hobbies[key]["hobbiesid"] = field.split("_")[1];
				key++;
			}
		}
		this.props.selectHobbies(hobbies);
	}

	render() {
		const { hobbiesDetail, hobbiesList, errors } = this.state;
		const hobbies =
			hobbiesList.map((value, key) =>
				<div className="multiple-checkbox col-sm-3" key={key}>
					<label className="custom-control fill-checkbox">
						<input type="checkbox" className="fill-control-input" ref={"hobbies_" + value.hobbiesid} defaultChecked={(hobbiesDetail["hobbies" + value.hobbiesid]) ? "checked" : null} onClick={() => this.handleHobbiesChange()} />
						<span className="fill-control-indicator"></span>
						<span className="fill-control-description">{value.hobbiesname}</span>
					</label>
				</div>
			);
		return (
			<div className="member-enroll">
				<div className="content-title flex-hr mb-0 title-description">
					<h3 className="title-has-control mt-2">Preferences & Interests</h3>
				</div>
				<hr className="mt-0" />
				<div className="row">
					<div className="col">
						<form id="form" className="clearfix position-relative" autoComplete="off">
							<Loader value={this.state.loading} />
							<div className="form-group row">
								<label className="col-sm-2 col-form-label" htmlFor="hobbies-view">Hobby </label>
								<div className="col-sm-10">
									<div className="row mt-2">
										{hobbies}
									</div>
									<span className="text-danger">{errors["hobbies"]}</span>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		)
	}
}