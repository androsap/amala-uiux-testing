import React, { Component } from 'react';
import { api } from '../../config/Services';
import Loader from '../../components/Loader';
import { SaveRequest } from '../../utilities/RequestService';
import Alert from '../../components/Alert';
import moment from 'moment';

export default class Step5 extends Component {
	constructor(props) {
		super(props);
		this.state = {
			errors: {},
			loading: false,
			cardnumber: props.enrollment.cardnumber,
			username: props.enrollment.email
		};
	}

	_grabUserInput() {
		return {
			cardnumber: this.refs.cardnumber.value,
			username: this.refs.username.value
		};
	}

	isValidated = () => {
		let errors = {};
		let status = true;
		const userInput = this._grabUserInput();

		//cardnumber
		if (userInput.cardnumber) {
			if (!userInput.cardnumber.match(/^[0-9]+$/)) {
				errors['cardnumber'] = 'Only numeric';
			} else if (userInput.cardnumber.length > 9) {
				errors['cardnumber'] = 'Maximum 9 characters';
			}
		}
		/*if (!userInput.cardnumber) {
			errors['cardnumber'] = 'Required';
		} else if (!userInput.cardnumber.match(/^[0-9]+$/)) {
			errors['cardnumber'] = 'Only numeric';
		} else if (userInput.cardnumber.length > 9) {
			errors['cardnumber'] = 'Maximum 9 characters';
		}*/

		//username
		if (!userInput.username) {
			errors['username'] = 'Required';
		}
		/*else if (!userInput.username.match(/^[a-zA-Z0-9._-]+$/)) {
			errors['username'] = 'Only alphanumeric and special character (.-_)';
		} else if (userInput.username.length < 6) {
			errors['username'] = 'Minimum 6 characters';
		} else if (userInput.username.length > 45) {
			errors['username'] = 'Maximum 45 characters';
		}*/

		if (Object.getOwnPropertyNames(errors).length > 0) {
			status = false;
		}

		this.setState({ errors: errors });
		this.props.updateStore({
			...userInput
		});

		if (status) {
			//tier&registration
			let tierid = (this.props.enrollment.tier) ? this.props.enrollment.tier : null;
			let enrollmentdate = (this.props.enrollment.enrolldate) ? moment(this.props.enrollment.enrolldate).format("YYYY-MM-DD") : null;
			// let enrollchannel = (this.props.enrollment.enrollchannel) ? this.props.enrollment.enrollchannel : null;
			let enrollchannel = 'BO';
			let nameoncard = (this.props.enrollment.nameoncard) ? this.props.enrollment.nameoncard : null;
			let cardnumber = (this.props.enrollment.cardnumber) ? this.props.enrollment.cardnumber : null;
			// let username = (this.props.enrollment.username) ? this.props.enrollment.username : null;
			let username = (this.props.enrollment.email) ? this.props.enrollment.email : null;
			//let status = 'ACTIVE';
			//personal information
			let salutationcode = (this.props.enrollment.salutation) ? this.props.enrollment.salutation : null;
			let titlecode = (this.props.enrollment.title) ? this.props.enrollment.title : null;
			let firstname = (this.props.enrollment.firstname) ? this.props.enrollment.firstname : null;
			let lastname = (this.props.enrollment.lastname) ? this.props.enrollment.lastname : null;
			let gender = (this.props.enrollment.gender) ? this.props.enrollment.gender : null;
			let dateofbirth = (this.props.enrollment.birthdate) ? moment(this.props.enrollment.birthdate).format("YYYY-MM-DD") : null;
			let nationality = (this.props.enrollment.nationality) ? this.props.enrollment.nationality : null;
			let religionid = (this.props.enrollment.religion) ? this.props.enrollment.religion : null;
			let langcode = (this.props.enrollment.language) ? this.props.enrollment.language : null;
			let passportnumber = (this.props.enrollment.passportno) ? this.props.enrollment.passportno : null;
			let idcardnumber = (this.props.enrollment.idcardno) ? this.props.enrollment.idcardno : null;
			let partnercode = null;
			//address&contact
			let email = (this.props.enrollment.email) ? this.props.enrollment.email : null;
			let mobilephonecode = (this.props.enrollment.mobilephonecode) ? this.props.enrollment.mobilephonecode : null;
			let mobilephonenumber = (this.props.enrollment.mobilephonenumber) ? this.props.enrollment.mobilephonenumber : null;
			let prefferedaddress = (this.props.enrollment.preferredaddress) ? this.props.enrollment.preferredaddress : null;
			let privateaddress = (this.props.enrollment.privateaddress) ? this.props.enrollment.privateaddress : null;
			let privatepostalcode = (this.props.enrollment.privatepostalcode) ? this.props.enrollment.privatepostalcode : null;
			let privatecity = (this.props.enrollment.privatecity) ? this.props.enrollment.privatecity : null;
			let privatephonecountrycode = (this.props.enrollment.privatephonecode) ? this.props.enrollment.privatephonecode : null;
			let privatephoneregion = (this.props.enrollment.privatephoneregion) ? this.props.enrollment.privatephoneregion : null;
			let privatephonenumber = (this.props.enrollment.privatephonenumber) ? this.props.enrollment.privatephonenumber : null;
			let privatefaxcode = (this.props.enrollment.privatefaxcode) ? this.props.enrollment.privatefaxcode : null;
			let privatefaxregion = (this.props.enrollment.privatefaxregion) ? this.props.enrollment.privatefaxregion : null;
			let privatefaxnumber = (this.props.enrollment.privatefaxnumber) ? this.props.enrollment.privatefaxnumber : null;
			let companyname = (this.props.enrollment.companyname) ? this.props.enrollment.companyname : null;
			let department = (this.props.enrollment.department) ? this.props.enrollment.department : null;
			let businessaddress = (this.props.enrollment.businessaddress) ? this.props.enrollment.businessaddress : null;
			let businesspostalcode = (this.props.enrollment.businesspostalcode) ? this.props.enrollment.businesspostalcode : null;
			let businesscity = (this.props.enrollment.businesscity) ? this.props.enrollment.businesscity : null;
			let businessphonecountrycode = (this.props.enrollment.businessphonecode) ? this.props.enrollment.businessphonecode : null;
			let businessphoneregion = (this.props.enrollment.businessphoneregion) ? this.props.enrollment.businessphoneregion : null;
			let businessphonenumber = (this.props.enrollment.businessphonenumber) ? this.props.enrollment.businessphonenumber : null;
			let businessfaxcode = (this.props.enrollment.businessfaxcode) ? this.props.enrollment.businessfaxcode : null;
			let businessfaxregion = (this.props.enrollment.businessfaxregion) ? this.props.enrollment.businessfaxregion : null;
			let businessfaxnumber = (this.props.enrollment.businessfaxnumber) ? this.props.enrollment.businessfaxnumber : null;
			let cobrandcode = (this.props.enrollment.cobrandcode) ? this.props.enrollment.cobrandcode : null;
			//hobbies
			let memberhobbies = this.props.enrollment.hobbies;

			let memberphones = [];
			let mobilephone = { phonetype: "MOBILE", countrycode: mobilephonecode, regioncode: null, phonenumber: mobilephonenumber };
			let businessphone = { phonetype: "BUSINESSPHONE", countrycode: businessphonecountrycode, regioncode: businessphoneregion, phonenumber: businessphonenumber };
			let businessfax = { phonetype: "BUSINESSFAX", countrycode: businessfaxcode, regioncode: businessfaxregion, phonenumber: businessfaxnumber };
			let privatephone = { phonetype: "PRIVATEPHONE", countrycode: privatephonecountrycode, regioncode: privatephoneregion, phonenumber: privatephonenumber };
			let privatefax = { phonetype: "PRIVATEFAX", countrycode: privatefaxcode, regioncode: privatefaxregion, phonenumber: privatefaxnumber };

			if (mobilephonecode) { memberphones.push(mobilephone); }
			if (businessphonenumber) { memberphones.push(businessphone); }
			if (businessfaxnumber) { memberphones.push(businessfax); }
			if (privatephonenumber) { memberphones.push(privatephone); }
			if (privatefaxnumber) { memberphones.push(privatefax); }

			//member address
			let memberaddress = [];
			memberaddress[0] = {
				addresstype: "PRIVATE",
				companyname: null,
				department: null,
				citycode: privatecity,
				address: privateaddress,
				postalcode: privatepostalcode,
				ispreffered: (prefferedaddress === 'Private') ? true : false
			}

			let addressbusiness = {
				addresstype: "BUSINESS",
				companyname: companyname,
				department: department,
				citycode: businesscity,
				address: businessaddress,
				postalcode: businesspostalcode,
				ispreffered: (prefferedaddress === 'Business') ? true : false
			}
			if (companyname) { memberaddress.push(addressbusiness) }

			/*memberaddress[1] = {
				addresstype: "PRIVATE",
				companyname: null,
				department: null,
				citycode: privatecity,
				address: privateaddress,
				postalcode: privatepostalcode,
				ispreffered: (prefferedaddress === 'Private') ? true : false
			}*/

			this.setState({ loading: true });

			let checkduplicate = true;
			let data = {
				username, titlecode, salutationcode, firstname, lastname, nameoncard, gender, partnercode,
				langcode, dateofbirth, nationality, religionid, passportnumber, idcardnumber, email, enrollchannel, enrollmentdate,
				memberphones, memberaddress, memberhobbies, checkduplicate
			};

			/* MEMBER COBRAND */
			// if (cobrandcode) {
			let membercobrand = {
				cobrandcode,
				applicationid: null,
				applicationdate: null,
				partnercustomerid: null,
				activitycode: null,
				pointconversion: null,
				mileageconversion: null,
				enrolldate: null,
				enrollfilename: null
			};
			data.membercobrand = membercobrand;
			// }

			/* MEMBER TIER */
			let membertier = {
				tierchangeprocess: "UPGRADE",
				tierid,
				startdate: moment(new Date()).format("YYYY-MM-DD"),
				enddate: null
			};
			data.membertier = membertier;

			/* MEMBER CARD */
			if (cardnumber) {
				let membercard = { cardnumber };
				data.membercard = membercard;
			}

			let message = 'New data has been created';
			let url = api.url.enrollment.enroll;
			var requestData = SaveRequest(url, data);
			if (requestData) {
				return requestData.then((response) => {
					const { responsecode, responsemessage } = response.status;
					if (responsecode.substring(0, 1) === '0') {
						message = (responsemessage) ? responsemessage : message;
						// this.props.updateStore({
						// 	response: response.result
						// });
						this.props.setReponse(response.result);
						Alert.success(message);
						//hide loader
						this.setState({ loading: false });
						return true;
					} else {
						Alert.error(responsemessage);
						//hide loader
						this.setState({ loading: false });
						return false;
					}
				})
			}
		} else {
			return false;
		}
	}

	handleCardNumberChange = (event) => {
		let cardnumber = event.target === null ? '' : event.target.value;
		this.setState({ cardnumber });
		this.props.saveCardNumber(cardnumber);
	}

	handleUsernameChange = (event) => {
		let username = event.target === null ? '' : event.target.value;
		this.setState({ username });
		this.props.saveUsername(username);
	}

	render() {
		const { cardnumber, username, loading } = this.state;
		return (
			<div className="member-enroll">
				<div className="content-title flex-hr mb-0 title-description">
					<h3 className="title-has-control mt-2">Member Account</h3>
				</div>
				<hr className="mt-0" />
				<div className="row">
					<div className="col">
						<form className="clearfix position-relative" autoComplete="off">
							<Loader value={loading} />
							<div className="row">
								<div className="col-md-6">
									<div className="form-group row">
										<label className="col-sm-4 col-form-label" htmlFor="username-view">Username </label>
										<div className="col-sm-8">
											<input className="form-control" type="text" id="username-view" ref="username" maxLength="45" defaultValue={username} onChange={this.handleUsernameChange} disabled />
											<span className="text-danger">{this.state.errors["username"]}</span>
										</div>
									</div>
									<div className="form-group row">
										<label className="col-sm-4 col-form-label" htmlFor="cardnumber-view">Card Number <p style={{ color: 'grey' }}><i>(optional)</i></p></label>
										<div className="col-sm-8">
											<input className="form-control" type="text" id="cardnumber-view" ref="cardnumber" maxLength="9" defaultValue={cardnumber} onChange={this.handleCardNumberChange} />
											<span className="text-danger">{this.state.errors["cardnumber"]}</span>
										</div>
									</div>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		)
	}
}