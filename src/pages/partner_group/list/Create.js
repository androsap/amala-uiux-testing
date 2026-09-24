import React, { Component } from 'react';
import { SaveRequest, RetrieveRequest } from '../../../utilities/RequestService';
import Alert from '../../../components/Alert';
import { api } from '../../../config/Services';
import Loader from '../../../components/Loader';
import Select2 from '../../../components/Select2';
import Datepicker from '../../../components/Datepicker';
import moment from "moment/moment";

class Layout extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			errors: {},
			effectivedate: null,
			discontinuedate: null,
			partnercode: null,
			optionsPartner: [],
		}
		this.closeAndRefresh = React.createRef();
	}

	handleValidation(field) {
		let errors = {};
		let status = true;

		//partnercode
		if (!field['partnercode']) {
			errors['partnercode'] = 'Required';
		}

		//effectivedate
		if (!field['effectivedate']) {
			errors['effectivedate'] = 'Required';
		}

		//discontinuedate
		if (!field['discontinuedate']) {
			errors['discontinuedate'] = 'Required';
		} else if (moment(field['discontinuedate']) < moment(field['effectivedate'])) {
			errors['discontinuedate'] = 'Discontinue Date invalid';
		}

		if (Object.getOwnPropertyNames(errors).length > 0) {
			status = false;
		}

		this.setState({ errors: errors });
		return status;
	}

	componentDidMount() {
		this.getOptionPartner();
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

		formData['partnercode'] = this.state.partnercode;
		formData['effectivedate'] = this.state.effectivedate;
		formData['discontinuedate'] = this.state.discontinuedate;
		if (this.handleValidation(formData)) {
			this.setState({ loading: true });
			let partnergroupcode = this.props.partnerGroupCode;
			let partnercode = formData.partnercode;
			let effectivedate = moment(formData.effectivedate).format("YYYY-MM-DD");
			let discontinuedate = moment(formData.discontinuedate).format("YYYY-MM-DD");

			let message = '';
			let url = api.url.partnergroup.addpartner;
			let data = { partnergroupcode, partnercode, effectivedate, discontinuedate };
			var requestData = SaveRequest(url, data);
			if (requestData) {
				requestData.then((response) => {
					if (response.status.responsecode.substring(0, 1) === '0') {
						if (!response.status.responsemessage) {
							message = 'New data has been created';
						} else {
							message = response.status.responsemessage;
						}
						Alert.success(message);
						this.closeModalSuccess();
					} else {
						Alert.error(response.status.responsemessage);
						this.setState({ loading: false });
					}
				})
			}
		}
	};

	closeModalSuccess = () => {
		this.closeAndRefresh.current.click();
	}

	getOptionPartner() {
		let paging = {
			limit: -1,
			page: 1
		}
		let sort = {
			partnername: 'asc'
		};
		let criteria = {}
		let url = api.url.partner.list;
		let column = ['partnercode', 'partnername'];
		var result = RetrieveRequest(url, paging, column, criteria, sort);
		result.then((response) => {
			if (response.status.responsecode.substring(0, 1) === '0') {
				//remapping for base option select2
				var result = response.result.map(obj => {
					var result2 = {};
					result2['label'] = obj.partnername;
					result2['value'] = obj.partnercode;
					return result2;
				})

				this.setState({
					optionsPartner: result
				});
			} else {
				Alert.error(response.status.responsemessage);
			}
		});
	}

	handlePartnerChange = (event) => {
		let partnercode = event === null ? null : event.value;
		this.setState({ partnercode });
	}

	handleEffectiveDateChange = (event) => {
		let effectivedate = event === null ? null : event;
		this.setState({ effectivedate });
	}

	handleDiscontinueDateChange = (event) => {
		let discontinuedate = event === null ? null : event;
		this.setState({ discontinuedate });
	}

	render() {
		const { loading, partnercode, optionsPartner, effectivedate, discontinuedate } = this.state;
		return (
			<div className="container-fluid">
				<div className="content-title flex-hr mb-0 title-description">
					<h3 className="title-has-control mt-2">Add Partner</h3>
				</div>
				<hr className="mt-0" />
				<div className="row">
					<div className="col-sm-12">
						<form className="clearfix position-relative" onSubmit={(e) => this.saveAction(e)} autoComplete="off">
							<Loader value={loading} />
							<div className="row">
								<div className="col-md-6">
									<div className="form-group row">
										<label className="col-sm-5 col-form-label" htmlFor="partnergroupcode-view">Partner Group Code</label>
										<div className="col-sm-7">
											<input className="form-control" type="text" id="partnergroupcode" value={this.props.partnerGroupCode} disabled />
										</div>
									</div>
									<div className="form-group row">
										<label className="col-sm-5 col-form-label" htmlFor="partnercode-view">Partner</label>
										<div className="col-sm-7">
											<Select2 reference="partnercode" className="reactSelect2" id="partnercode-view" options={optionsPartner} onChange={this.handlePartnerChange} value={optionsPartner.filter(({ value }) => value === partnercode)}></Select2>
											<span className="text-danger">{this.state.errors["partnercode"]}</span>
										</div>
									</div>
								</div>
								<div className="col-md-6">
									<div className="form-group row">
										<label className="col-sm-5 col-form-label" htmlFor="effectivedate-view">Effective Date</label>
										<div className="col-sm-7">
											<Datepicker className="form-control" id="effectivedate-view" onChange={this.handleEffectiveDateChange} selected={effectivedate} dateFormat={"DD/MM/YYYY"} />
											<span className="text-danger">{this.state.errors["effectivedate"]}</span>
										</div>
									</div>
									<div className="form-group row">
										<label className="col-sm-5 col-form-label" htmlFor="discontinuedate-view">Dicontinue Date</label>
										<div className="col-sm-7">
											<Datepicker className="form-control" id="discontinuedate-view" onChange={this.handleDiscontinueDateChange} selected={discontinuedate} dateFormat={"DD/MM/YYYY"} />
											<span className="text-danger">{this.state.errors["discontinuedate"]}</span>
										</div>
									</div>
								</div>
							</div>
							<div className="box-footer text-center">
								<button type="submit" className="btn btn-outline-dark normal">Save</button>
								&nbsp;&nbsp;
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