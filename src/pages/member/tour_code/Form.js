import React, { Component } from 'react';
import Alert from '../../../components/Alert';
import { api } from '../../../config/Services';
import { SaveRequest } from '../../../utilities/RequestService';
import Loader from '../../../components/Loader';
import Datepicker from "../../../components/Datepicker";
import moment from "moment";
import { _getUserPermission, _checkPermission } from '../../../utilities/PermissionService';

var permissionList = _getUserPermission();
var menuname = 'membertourcode';

class Layout extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			errors: {},
			startdate: null,
			enddate: null
		}
		this.closeAndRefresh = React.createRef();
	}

	handleValidation(field) {
		let errors = {};
		let status = true;

		//tourcode
		if (!field['tourcode']) {
			errors['tourcode'] = 'Required';
		} else if (!field['tourcode'].match(/^[a-zA-Z0-9\s]+$/)) {
			errors['tourcode'] = 'Only alphanumeric and space';
		}

		//startdate
		if (!field['startdate']) {
			errors['startdate'] = 'Required';
		}

		//enddate
		if (!field['enddate']) {
			errors['enddate'] = 'Required';
		}

		if (Object.getOwnPropertyNames(errors).length > 0) {
			status = false;
		}

		this.setState({ errors: errors });
		return status;
	}

	componentDidMount() {
		if (!_checkPermission(permissionList, menuname, "access")) {
			if (_checkPermission(permissionList, menuname, "create")) {
				this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
			}
		} else {
			this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
		}
	}

	saveAction = (e) => {
		e.preventDefault();
		const formData = {};
		var tempVal = '';
		for (const field in this.refs) {
			tempVal = this.refs[field].value;
			if (tempVal) {
				tempVal = tempVal.trim();
			}
			formData[field] = tempVal;
		}
		formData['startdate'] = this.state.startdate;
		formData['enddate'] = this.state.enddate;
		if (this.handleValidation(formData)) {
			this.setState({ loading: true });
			let tourcode = formData.tourcode.toUpperCase();
			let startdate = (formData.startdate) ? moment(formData.startdate).format("YYYY-MM-DD") : null;
			let enddate = (formData.enddate) ? moment(formData.enddate).format("YYYY-MM-DD") : null;
			let corporatecode = this.props.corporatecode;

			let url = api.url.tourcode.create;
			let data = { tourcode, startdate, enddate, corporatecode };
			let message = 'New data has been created';
			var requestData = SaveRequest(url, data);
			if (requestData) {
				requestData.then((response) => {
					const { responsecode, responsemessage } = response.status;
					if (responsecode.substring(0, 1) === '0') {
						message = (responsemessage) ? responsemessage : message;
						Alert.success(message);
                        this.closeModalSuccess();
					} else {
						Alert.error(responsemessage);
					}
					//hide loader
					this.setState({ loading: false });
				})
			}
		}
	};

	closeModalSuccess = () => {
		this.closeAndRefresh.current.click();
	}

	handleChangePage(displayPage) {
		this.props.updatePage({
			displayactivitypage: displayPage
		});
	}

	handleStartDateChange = (event) => {
		let startdate = event === null ? null : event;
		this.setState({ startdate });
	};

	handleEndDateChange = (event) => {
		let enddate = event === null ? null : event;
		this.setState({ enddate });
	};

	render() {
		const { errors, loading, startdate, enddate } = this.state;
		return (
			<div className="container-fluid">
				<div className="content-title flex-hr mb-0 title-description">
					<h1 className="title-has-control mt-2">Create Tour Code</h1>
				</div>
				<hr className="mt-0" />
				<div className="row">
					<div className="col-sm-12">
						<form className="clearfix position-relative" onSubmit={(e) => this.saveAction(e)} autoComplete="off">
							<Loader value={loading} />
							<div className="row">
								<div className="col-sm-6">
									<div className="form-group row">
										<label className="col-sm-4 col-form-label" htmlFor="tourcode-view">Tour Code </label>
										<div className="col-sm-8">
											<input className="form-control" type="text" id="tourcode-view" ref="tourcode" maxLength="20" />
											<span className="text-danger">{errors["tourcode"]}</span>
										</div>
									</div>
								</div>
								<div className="col-sm-6">
									<div className="form-group row">
										<label className="col-md-4 form-label" htmlFor="startdate-view">Start Date </label>
										<div className="col-sm-8">
											<Datepicker className="form-control" onChange={this.handleStartDateChange} selected={startdate} dateFormat={"DD/MM/YYYY"} minDate={moment(new Date()).add(1, 'days')} />
											<span className="text-danger">{errors["startdate"]}</span>
										</div>
									</div>
									<div className="form-group row">
										<label className="col-md-4 form-label" htmlFor="enddate-view">End Date </label>
										<div className="col-sm-8">
											<Datepicker className="form-control" onChange={this.handleEndDateChange} selected={enddate} dateFormat={"DD/MM/YYYY"} minDate={moment(startdate)} />
											<span className="text-danger">{errors["enddate"]}</span>
										</div>
									</div>
								</div>
							</div>
							<div className="box-footer text-center">
								<button type="submit" className="btn btn-outline-dark normal mr-2">Save</button>
								<button type="button" ref={this.closeAndRefresh} onClick={this.props.closeModalRefresh} className="hidden">Close Refresh</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		)
	}
}

export default Layout;