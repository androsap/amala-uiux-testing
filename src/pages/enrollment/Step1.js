import React, { Component } from 'react';
import Datepicker from '../../components/Datepicker';
import Select2 from '../../components/Select2';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';
import Alert from '../../components/Alert';
import moment from 'moment';
// import { getGeneralConfig } from '../../utilities/Helpers';
// import { general_config } from '../../utilities/Constant';

export default class Layout extends Component {
	constructor(props) {
		super(props);
		this.state = {
			errors: {},
			tier: props.enrollment.tier,
			enrolldate: props.enrollment.enrolldate,
			// enrollchannel: props.enrollment.enrollchannel,
			isenrollcobrand: props.enrollment.isenrollcobrand,
			partnercode: props.enrollment.partnercode,
			cobrandcode: props.enrollment.cobrandcode,
			membershipid: props.enrollment.membershipid,
			// enrollchannelist: props.enrollment.enrollchannelist,
			minbirthdate: props.enrollment.minbirthdate,
			maxbirthdate: props.enrollment.maxbirthdate,
			optionsTier: [],
			optionsPartner: [],
			optionsCobrand: [],
			optionsMileageCriteria: [],
			partnercodedisabled: true,
			cobrandcodedisabled: true,
			isLoadingSelect2: {
				tier: false,
				partnercode: false,
				cobrandcode: false,
			}
		};
	}

	_grabUserInput() {
		return {
			tier: this.state.tier,
			enrolldate: this.state.enrolldate,
			// enrollchannel: this.state.enrollchannel,
			isenrollcobrand: this.state.isenrollcobrand,
			partnercode: this.state.partnercode,
			cobrandcode: this.state.cobrandcode
		};
	}

	componentWillMount() {
		this.getOptionsTier();
		const { isenrollcobrand, partnercode } = this.state;

		/* validation mileage criteria */
		if (this.props.enrollment.tier) { this.getMileageCriteria(this.props.enrollment.tier); }

		/* if enroll conbrand */
		if (isenrollcobrand) {
			this.getOptionsPartner();
			this.getOptionsPartnerCobrand(partnercode);
			let partnercodedisabled = false;
			let cobrandcodedisabled = false;
			this.setState({ partnercodedisabled, cobrandcodedisabled });
		}

		//if tier null, set default
		/*if (this.props.enrollment.tier === null) {
			getGeneralConfig(general_config.default_tier).then((tier) => {
				this.setState({ tier });
				this.props.selectTier(tier);
				this.getMileageCriteria(tier);
			});
		}*/
	}

	getOptionsTier() {
		let membershipid = this.props.location.state.membershipid;
		let paging = {
			limit: -1,
			page: 1
		}
		let sort = {
			tiername: 'asc'
		};
		let criteria = { membershipid };
		let url = api.url.tierrank.list;
		let column = [];
		/*loading select2 get data*/
		this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, tier: true } }));
		var result = RetrieveRequest(url, paging, column, criteria, sort);
		result.then((response) => {
			const { status, result } = response;
			if (status.responsecode.substring(0, 1) === '0') {
				//remapping for base option select2
				var optionsTier = result.map(obj => {
					var result2 = {};
					result2['label'] = obj.tiername;
					result2['value'] = obj.tierid;
					result2['rank'] = obj.rank;
					return result2;
				});

				let tier = this.props.enrollment.tier;
				if (this.props.enrollment.tier === null) {
					let max_rank = Math.max.apply(Math, optionsTier.map(function (o) { return o.rank; }))
					tier = optionsTier.filter(function (obj) { return obj.rank === max_rank; });
					tier = (tier[0] !== undefined && tier[0]["value"] !== undefined) ? tier[0]["value"] : null;
				}

				this.props.selectTier(tier);
				this.setState(prevState => ({
					optionsTier,
					tier,
					isLoadingSelect2: { ...prevState.isLoadingSelect2, tier: false }
				}), this.getMileageCriteria(tier));
			} else {
				Alert.error(status.responsemessage);
			}
		});
	}

	getOptionsPartner() {
		let paging = {
			limit: -1,
			page: 1
		}
		let sort = {
			partnername: 'asc'
		};
		let criteria = {
			partnertype: "NonAir"
		};
		let url = api.url.partner.list;
		let column = [];
		/*loading select2 get data*/
		this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, partnercode: true } }));
		var result = RetrieveRequest(url, paging, column, criteria, sort);
		result.then((response) => {
			const { status, result } = response;
			if (status.responsecode.substring(0, 1) === '0') {
				//remapping for base option select2
				var optionsPartner = result.map(obj => {
					var result2 = {};
					result2['label'] = obj.partnername;
					result2['value'] = obj.partnercode;
					return result2;
				})

				this.setState(prevState => ({
					optionsPartner,
					isLoadingSelect2: { ...prevState.isLoadingSelect2, partnercode: false }
				}));
			} else {
				Alert.error(status.responsemessage);
			}
		});
	}

	getOptionsPartnerCobrand(partnercode) {
		let paging = {
			limit: -1,
			page: 1
		}
		let sort = {
			cobrandname: 'asc'
		};
		let criteria = { partnercode };
		let url = api.url.partnercobrand.list;
		let column = [];
		/*loading select2 get data*/
		this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, cobrandcode: true } }));
		var result = RetrieveRequest(url, paging, column, criteria, sort);
		result.then((response) => {
			const { status, result } = response;
			if (status.responsecode.substring(0, 1) === '0') {
				//remapping for base option select2
				var optionsCobrand = result.map(obj => {
					var result2 = {};
					result2['label'] = obj.cobrandname;
					result2['value'] = obj.cobrandcode;
					return result2;
				})

				this.setState(prevState => ({
					optionsCobrand,
					isLoadingSelect2: { ...prevState.isLoadingSelect2, cobrandcode: false }
				}));
			} else {
				Alert.error(status.responsemessage);
			}
		});
	}

	isValidated() {
		let errors = {};
		let status = true;
		const userInput = this._grabUserInput();

		//tier
		if (!userInput.tier) {
			errors['tier'] = 'Required';
		} else if (this.state.optionsMileageCriteria.length === 0) {
			errors['tier'] = "Tier hasn't setup mileage criteria";
		}

		//enrolldate
		if (!userInput.enrolldate) {
			errors['enrolldate'] = 'Required';
		} else if (userInput.enrolldate.length > 10) {
			errors['enrolldate'] = 'Maximum 10 characters';
		}

		// //enrollchannel
		// if (!userInput.enrollchannel) {
		// 	errors['enrollchannel'] = 'Required';
		// }

		if (userInput.isenrollcobrand) {
			//partnercode
			if (!userInput.partnercode) {
				errors['partnercode'] = 'Required';
			}
			//cobrandcode
			if (!userInput.cobrandcode) {
				errors['cobrandcode'] = 'Required';
			}
		}

		if (Object.getOwnPropertyNames(errors).length > 0) {
			status = false;
		}

		this.setState({ errors: errors });

		return status;
	}

	getMileageCriteria(tierid) {
		let paging = {
			limit: -1,
			page: 1
		}
		let sort = {
			tierid: 'asc'
		};
		let criteria = {
			tierid,
			type: "UPGRADE"
		};
		let url = api.url.mileagecriteria.list;
		let column = [];
		var result = RetrieveRequest(url, paging, column, criteria, sort);
		result.then((response) => {
			const { status, result } = response;
			if (status.responsecode.substring(0, 1) === '0') {
				//remapping for base option select2
				var optionsMileageCriteria = result.map(obj => {
					var result2 = {};
					result2['mileagecriteriaid'] = obj.mileagecriteriaid;
					result2['minage'] = obj.minage;
					result2['maxage'] = obj.maxage;
					result2['effectivedate'] = obj.effectivedate;
					result2['expireddate'] = obj.expireddate;
					return result2;
				}).filter(obj => {
					var today = moment(new Date());
					var effdate = moment(new Date(obj.effectivedate));
					var disdate = moment(new Date(obj.expireddate));
					return effdate <= today && today <= disdate;
				});

				let minbirthdate = moment(new Date());
				let maxbirthdate = null;
				let errors = [];

				if (optionsMileageCriteria.length > 0) {
					if (optionsMileageCriteria[0] !== undefined && optionsMileageCriteria[0].minage !== undefined) {
						minbirthdate = moment(moment().add(-optionsMileageCriteria[0].minage, 'years'));
					}
					if (optionsMileageCriteria[0] !== undefined && optionsMileageCriteria[0].maxage !== undefined) {
						maxbirthdate = moment(moment().add(-(optionsMileageCriteria[0].maxage + 1), 'years').add(+1, 'days'));
					}
					errors['tier'] = "";
				} else {
					errors['tier'] = "Tier hasn't setup mileage criteria";
				}

				this.props.selectMinDateOfBirth(minbirthdate);
				this.props.selectMaxDateOfBirth(maxbirthdate);

				this.setState({ optionsMileageCriteria, errors });
			} else {
				Alert.error(status.responsemessage);
			}
		});
	}

	handleTierChange = (event) => {
		let tier = event === null ? null : event.value;
		this.setState({ tier });
		this.props.selectTier(tier);

		this.getMileageCriteria(tier);
	}

	handlePartnerCobrandChange = (event) => {
		let cobrandcode = event === null ? null : event.value;
		this.setState({ cobrandcode });
		this.props.selectCobrand(cobrandcode);
	}

	handlePartnerChange = (event) => {
		let partnercode = event === null ? null : event.value;
		let cobrandcode = null;
		let cobrandcodedisabled = true;
		if (partnercode) {
			cobrandcodedisabled = false;
			this.getOptionsPartnerCobrand(partnercode);
		}
		this.setState({ partnercode, cobrandcode, cobrandcodedisabled });
		this.props.selectPartner(partnercode);
	}

	handleEnrollDateChange = (event) => {
		let enrolldate = event === null ? null : event;
		this.setState({ enrolldate });
		this.props.selectEnrollDate(enrolldate);
	}

	handleEnrollChannelChange = (event) => {
		let enrollchannel = event === null ? null : event.target.value;
		this.setState({ enrollchannel });
		this.props.selectEnrollChannel(enrollchannel);
	}

	handleIsEnrollCobrandChange = (event) => {
		let isenrollcobrand = event === null ? null : event.target.checked;
		let partnercodedisabled = true;
		let partnercode = null;
		let cobrandcodedisabled = true;
		let cobrandcode = null
		if (isenrollcobrand) {
			this.getOptionsPartner();
			partnercodedisabled = false;
		}
		this.setState({ isenrollcobrand, partnercode, partnercodedisabled, cobrandcodedisabled, cobrandcode });
		this.props.selectIsEnrollCobrand(isenrollcobrand);
	}

	render() {
		// const { isLoadingSelect2, optionsTier, tier, enrolldate, enrollchannelist, enrollchannel, isenrollcobrand, errors,
		// 	optionsPartner, partnercode, partnercodedisabled, optionsCobrand, cobrandcode, cobrandcodedisabled } = this.state;
		const { isLoadingSelect2, optionsTier, tier, enrolldate, errors,
			// isenrollcobrand, optionsPartner, partnercode, partnercodedisabled, optionsCobrand, cobrandcode, cobrandcodedisabled 
		} = this.state;
		// const enrollchanneldata =
		// 	enrollchannelist.map((data, key) =>
		// 		<div className="col-sm-6" key={key}>
		// 			<label htmlFor={"reg" + key}><input name="enrollchannel" id={"reg" + key} tabIndex="-1" value={data.value} type="radio" onChange={this.handleEnrollChannelChange} checked={enrollchannel === data.value} /> {data.label}</label>
		// 		</div>
		// 	);

		return (
			<div className="member-enroll">
				<div className="content-title flex-hr mb-0 title-description">
					<h3 className="title-has-control mt-2">Tier & Registration</h3>
				</div>
				<hr className="mt-0" />
				<div className="row">
					<div className="col">
						<form className="clearfix position-relative" autoComplete="off">
							<div className="row">
								<div className="col-md-6">
									<div className="form-group row">
										<label className="col-sm-4 col-form-label" htmlFor="tier-view">Tier </label>
										<div className="col-sm-8">
											<Select2 reference="tier" className="reactSelect2" id="tier-view" options={optionsTier} onChange={this.handleTierChange} value={optionsTier.filter(({ value }) => value === tier)} isLoading={isLoadingSelect2.tier} disabled></Select2>
											<span className="text-danger">{errors["tier"]}</span>
										</div>
									</div>
									<div className="form-group row">
										<label className="col-sm-4 col-form-label" htmlFor="enrolldate-view">Date of Enrollment </label>
										<div className="col-sm-8">
											<Datepicker className="form-control" id="enrolldate-view" onChange={this.handleEnrollDateChange} selected={enrolldate} dateFormat={"DD/MM/YYYY"} maxDate={moment(new Date())} />
											<span className="text-danger">{errors["enrolldate"]}</span>
										</div>
									</div>
									<div className="form-group row">
										<label className="col-sm-4 col-form-label" htmlFor="enrollchannel-view">Form of Registration </label>
										<div className="col-sm-8">
											<input className="form-control" type="text" id="enrollchannel-view" ref="enrollchannel" maxLength="45" value="Back Office" disabled />
										</div>
									</div>
									{/* <div className="form-group row">
										<label className="col-sm-4 col-form-label">Form of Registration</label>
										<div className="col-sm-8">
											<div className="row mt-2">
												{enrollchanneldata}
											</div>
											<span className="text-danger">{errors["enrollchannel"]}</span>
										</div>
									</div> */}
								</div>
								{/* <div className="col-md-6">
									<div className="form-group row">
										<label className="col-sm-4 col-form-label" htmlFor="isenrollcobrand-view">Enroll Cobrand ?</label>
										<div className="col-sm-8">
											<div className="row no-gutters">
												<label className="custom-control border-switch">
													<input id="isenrollcobrand-view" ref="isenrollcobrand" className="border-switch-control-input" type="checkbox" onClick={this.handleIsEnrollCobrandChange} defaultChecked={(isenrollcobrand) ? "checked" : null} />
													<span className="border-switch-control-description">No</span>
													<span className="border-switch-control-indicator"></span>
													<span className="border-switch-control-description">Yes</span>
												</label>
											</div>
										</div>
									</div>
									<div className="form-group row">
										<label className="col-sm-4 col-form-label" htmlFor="partnercode-view">Partner </label>
										<div className="col-sm-8">
											<Select2 reference="partnercode" className="reactSelect2" id="partnercode-view" options={optionsPartner} onChange={this.handlePartnerChange} value={optionsPartner.filter(({ value }) => value === partnercode)} isLoading={isLoadingSelect2.partnercode} disabled={partnercodedisabled}></Select2>
											<span className="text-danger">{errors["partnercode"]}</span>
										</div>
									</div>
									<div className="form-group row">
										<label className="col-sm-4 col-form-label" htmlFor="cobrandcode-view">Cobrand </label>
										<div className="col-sm-8">
											<Select2 reference="cobrandcode" className="reactSelect2" id="cobrandcode-view" options={optionsCobrand} onChange={this.handlePartnerCobrandChange} value={optionsCobrand.filter(({ value }) => value === cobrandcode)} isLoading={isLoadingSelect2.cobrandcode} disabled={cobrandcodedisabled}></Select2>
											<span className="text-danger">{errors["cobrandcode"]}</span>
										</div>
									</div>
								</div> */}
							</div>
						</form>
					</div>
				</div>
			</div>
		)
	}
}