import React, { Component } from 'react';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';
import Select2 from '../../components/Select2';
import Alert from '../../components/Alert';

export default class Step1 extends Component {
	constructor(props) {
		super(props);
		this.state = {
			errors: {},
			optionsPhoneCode: [],
			optionsCountry: [],
			email: props.enrollment.email,
			mobilephonecode: props.enrollment.mobilephonecode,
			mobilephonenumber: props.enrollment.mobilephonenumber,
			preferredaddress: props.enrollment.preferredaddress,
			privateaddress: props.enrollment.privateaddress,
			privatepostalcode: props.enrollment.privatepostalcode,
			privatecountry: props.enrollment.privatecountry,
			privateprovince: props.enrollment.privateprovince,
			privatecity: props.enrollment.privatecity,
			privatephonecode: props.enrollment.privatephonecode,
			privatephoneregion: props.enrollment.privatephoneregion,
			privatephonenumber: props.enrollment.privatephonenumber,
			privatefaxcode: props.enrollment.privatefaxcode,
			privatefaxregion: props.enrollment.privatefaxregion,
			privatefaxnumber: props.enrollment.privatefaxnumber,
			companyname: props.enrollment.companyname,
			department: props.enrollment.department,
			businessaddress: props.enrollment.businessaddress,
			businesspostalcode: props.enrollment.businesspostalcode,
			businesscountry: props.enrollment.businesscountry,
			businessprovince: props.enrollment.businessprovince,
			businesscity: props.enrollment.businesscity,
			businessphonecode: props.enrollment.businessphonecode,
			businessphoneregion: props.enrollment.businessphoneregion,
			businessphonenumber: props.enrollment.businessphonenumber,
			businessfaxcode: props.enrollment.businessfaxcode,
			businessfaxregion: props.enrollment.businessfaxregion,
			businessfaxnumber: props.enrollment.businessfaxnumber,
			optionsPrivateProvince: [],
			privateprovincedisabled: true,
			optionsBusinessProvince: [],
			businessprovincedisabled: true,
			optionsPrivateCity: [],
			privatecitydisabled: true,
			optionsBusinessCity: [],
			businesscitydisabled: true,
			isLoadingSelect2: {
				phonecode: false,
				countrycode: false,
				businessprovince: false,
				businesscity: false,
				privateprovince: false,
				privatecity: false
			}
		};
	}

	_grabUserInput() {
		return {
			email: this.refs.email.value,
			mobilephonecode: this.state.mobilephonecode,
			mobilephonenumber: this.refs.mobilephonenumber.value,
			preferredaddress: this.state.preferredaddress,
			privateaddress: this.refs.privateaddress.value,
			privatepostalcode: this.refs.privatepostalcode.value,
			privatecountry: this.state.privatecountry,
			privateprovince: this.state.privateprovince,
			privatecity: this.state.privatecity,
			privatephonecode: this.state.privatephonecode,
			privatephoneregion: this.refs.privatephoneregion.value,
			privatephonenumber: this.refs.privatephonenumber.value,
			// privatefaxcode: this.state.privatefaxcode,
			// privatefaxregion: this.refs.privatefaxregion.value,
			// privatefaxnumber: this.refs.privatefaxnumber.value,
			companyname: this.refs.companyname.value,
			department: this.refs.department.value,
			businessaddress: this.refs.businessaddress.value,
			businesspostalcode: this.refs.businesspostalcode.value,
			businesscountry: this.state.businesscountry,
			businessprovince: this.state.businessprovince,
			businesscity: this.state.businesscity,
			businessphonecode: this.state.businessphonecode,
			businessphoneregion: this.refs.businessphoneregion.value,
			businessphonenumber: this.refs.businessphonenumber.value,
			// businessfaxcode: this.state.businessfaxcode,
			// businessfaxregion: this.refs.businessfaxregion.value,
			// businessfaxnumber: this.refs.businessfaxnumber.value,
		};
	}

	componentDidMount() {
		this.getOptionsCountry();
		this.getOptionsPhoneCode();
	}

	getOptionsCountry() {
		let paging = {
			limit: -1,
			page: 1
		}
		let sort = {
			countryname: 'asc'
		};
		let criteria = { active: true };
		let url = api.url.country.list;
		let column = [];
		/*loading select2 get data*/
		this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, countrycode: true } }));
		var result = RetrieveRequest(url, paging, column, criteria, sort);
		result.then((response) => {
			const { status, result } = response;
			if (status.responsecode.substring(0, 1) === '0') {
				//remapping for base option select2
				var optionsCountry = result.map(obj => {
					var result2 = {};
					result2['label'] = obj.countryname;
					result2['value'] = obj.countrycode;
					return result2;
				})


				this.setState(prevState => ({
					optionsCountry,
					isLoadingSelect2: { ...prevState.isLoadingSelect2, countrycode: false }
				}));
			} else {
				Alert.error(status.responsemessage);
			}
		});
	}

	getOptionsPhoneCode() {
		let paging = {
			limit: -1,
			page: 1
		}
		let sort = {
			countryname: 'asc'
		};
		let criteria = { active: true };
		let url = api.url.country.list;
		let column = [];
		/*loading select2 get data*/
		this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, phonecode: true } }));
		var result = RetrieveRequest(url, paging, column, criteria, sort);
		result.then((response) => {
			const { status, result } = response;
			if (status.responsecode.substring(0, 1) === '0') {
				//remapping for base option select2
				var optionsPhoneCode = result.map(obj => {
					var result2 = {};
					result2['label'] = `${obj.countryname} (${obj.countryphonecode})`;
					result2['value'] = obj.countrycode;
					return result2;
				})


				this.setState(prevState => ({
					optionsPhoneCode,
					isLoadingSelect2: { ...prevState.isLoadingSelect2, phonecode: false }
				}));
			} else {
				Alert.error(status.responsemessage);
			}
		});
	}

	isValidated = () => {
		let errors = {};
		let status = true;
		const userInput = this._grabUserInput();

		//email
		if (!userInput.email) {
			errors['email'] = 'Required';
		} else if (userInput.email.length > 45) {
			errors['email'] = 'Maximum 45 characters';
		} else if (!userInput.email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
			errors['email'] = 'Invalid email address';
		}

		//mobile phone code
		if (!userInput.mobilephonecode) {
			errors['mobilephonecode'] = 'Required';
		}

		//mobile phone number
		if (!userInput.mobilephonenumber) {
			errors['mobilephonenumber'] = 'Required';
		} else if (userInput.mobilephonenumber.length > 20) {
			errors['mobilephonenumber'] = 'Maximum 20 characters';
		} else if (!userInput.mobilephonenumber.match(/^\+?([0-9])+$/)) {
			errors['mobilephonenumber'] = 'Only numeric';
		} else if (userInput.mobilephonenumber.charAt(0) === '0') {
			errors['mobilephonenumber'] = 'Invalid mobile phone';
		}

		/*//private address
		if (!userInput.privateaddress) {
			errors['privateaddress'] = 'Required';
		}*/

		//private postal code
		if (userInput.privatepostalcode) {
			if (!userInput.privatepostalcode.match(/^[0-9]+$/)) {
				errors['privatepostalcode'] = 'Only numeric';
			} else if (userInput.privatepostalcode.length > 5) {
				errors['privatepostalcode'] = 'Maximum 5 characters';
			}
		}
		/*if (!userInput.privatepostalcode) {
			errors['privatepostalcode'] = 'Required';
		} else if (!userInput.privatepostalcode.match(/^[0-9]+$/)) {
			errors['privatepostalcode'] = 'Only numeric';
		} else if (userInput.privatepostalcode.length > 5) {
			errors['privatepostalcode'] = 'Maximum 5 characters';
		}*/

		//private country
		if (!userInput.privatecountry) {
			errors['privatecountry'] = 'Required';
		}

		//private province
		if (!userInput.privateprovince) {
			errors['privateprovince'] = 'Required';
		}

		//private city
		if (!userInput.privatecity) {
			errors['privatecity'] = 'Required';
		}

		if (userInput.preferredaddress === 'Business' || userInput.companyname || userInput.businessaddress || userInput.businesspostalcode || userInput.businesscountry || userInput.businessprovince || userInput.businesscity) {
			//company name
			if (!userInput.companyname) {
				errors['companyname'] = 'Required';
			}

			//department
			if (!userInput.department) {
				errors['department'] = 'Required';
			}

			//business address
			/*if (!userInput.businessaddress) {
				errors['businessaddress'] = 'Required';
			}*/

			//business postal code
			if (userInput.businesspostalcode) {
				if (!userInput.businesspostalcode.match(/^[0-9]+$/)) {
					errors['businesspostalcode'] = 'Only numeric';
				} else if (userInput.businesspostalcode.length > 5) {
					errors['businesspostalcode'] = 'Maximum 5 characters';
				}
			}
			/*if (!userInput.businesspostalcode) {
				errors['businesspostalcode'] = 'Required';
			} else if (!userInput.businesspostalcode.match(/^[0-9]+$/)) {
				errors['businesspostalcode'] = 'Only numeric';
			} else if (userInput.businesspostalcode.length > 5) {
				errors['businesspostalcode'] = 'Maximum 5 characters';
			}*/

			//business country
			if (!userInput.businesscountry) {
				errors['businesscountry'] = 'Required';
			}

			//business province
			if (!userInput.businessprovince) {
				errors['businessprovince'] = 'Required';
			}

			//business city
			if (!userInput.businesscity) {
				errors['businesscity'] = 'Required';
			}
		}

		//private phone
		if (userInput.privatephonecode || userInput.privatephoneregion || userInput.privatephonenumber) {
			//private phone code
			if (!userInput.privatephonecode) {
				errors['privatephonecode'] = 'Required';
			}

			//private phone region
			if (!userInput.privatephoneregion) {
				errors['privatephoneregion'] = 'Required';
			} else if (userInput.privatephoneregion.length > 3) {
				errors['privatephoneregion'] = 'Maximum 3 characters';
			} else if (!userInput.privatephoneregion.match(/^\+?([0-9])+$/)) {
				errors['privatephoneregion'] = 'Invalid phone region';
			}

			//private phone number
			if (!userInput.privatephonenumber) {
				errors['privatephonenumber'] = 'Required';
			} else if (userInput.privatephonenumber.length > 20) {
				errors['privatephonenumber'] = 'Maximum 20 characters';
			} else if (!userInput.privatephonenumber.match(/^\+?([0-9])+$/) || userInput.privatephonenumber.charAt(0) === '0') {
				errors['privatephonenumber'] = 'Invalid phone number';
			}
		}

		/*//private fax
		if (userInput.privatefaxcode || userInput.privatefaxregion || userInput.privatefaxnumber) {
			//private fax code
			if (!userInput.privatefaxcode) {
				errors['privatefaxcode'] = 'Required';
			}

			//private fax region
			if (!userInput.privatefaxregion) {
				errors['privatefaxregion'] = 'Required';
			} else if (userInput.privatefaxregion.length > 5) {
				errors['privatefaxregion'] = 'Maximum 5 characters';
			} else if (!userInput.privatefaxregion.match(/^\+?([0-9])+$/)) {
				errors['privatefaxregion'] = 'Invalid fax region';
			}

			//private fax number
			if (!userInput.privatefaxnumber) {
				errors['privatefaxnumber'] = 'Required';
			} else if (userInput.privatefaxnumber.length > 20) {
				errors['privatefaxnumber'] = 'Maximum 20 characters';
			} else if (!userInput.privatefaxnumber.match(/^\+?([0-9])+$/)) {
				errors['privatefaxnumber'] = 'Invalid fax number';
			}
		}*/

		//business phone
		if (userInput.businessphonecode || userInput.businessphoneregion || userInput.businessphonenumber) {
			//business phone code
			if (!userInput.businessphonecode) {
				errors['businessphonecode'] = 'Required';
			}

			//business phone region
			if (!userInput.businessphoneregion) {
				errors['businessphoneregion'] = 'Required';
			} else if (userInput.businessphoneregion.length > 3) {
				errors['businessphoneregion'] = 'Maximum 3 characters';
			} else if (!userInput.businessphoneregion.match(/^\+?([0-9])+$/)) {
				errors['businessphoneregion'] = 'Invalid phone region';
			}

			//business phone number
			if (!userInput.businessphonenumber) {
				errors['businessphonenumber'] = 'Required';
			} else if (userInput.businessphonenumber.length > 20) {
				errors['businessphonenumber'] = 'Maximum 20 characters';
			} else if (!userInput.businessphonenumber.match(/^\+?([0-9])+$/) || userInput.businessphonenumber.charAt(0) === '0') {
				errors['businessphonenumber'] = 'Invalid phone number';
			}
		}

		/*//business fax
		if (userInput.businessfaxcode || userInput.businessfaxregion || userInput.businessfaxnumber) {
			//business fax code
			if (!userInput.businessfaxcode) {
				errors['businessfaxcode'] = 'Required';
			}

			//business fax region
			if (!userInput.businessfaxregion) {
				errors['businessfaxregion'] = 'Required';
			} else if (userInput.businessfaxregion.length > 5) {
				errors['businessfaxregion'] = 'Maximum 5 characters';
			} else if (!userInput.businessfaxregion.match(/^\+?([0-9])+$/)) {
				errors['businessfaxregion'] = 'Invalid fax region';
			}

			//business fax number
			if (!userInput.businessfaxnumber) {
				errors['businessfaxnumber'] = 'Required';
			} else if (userInput.businessfaxnumber.length > 20) {
				errors['businessfaxnumber'] = 'Maximum 20 characters';
			} else if (!userInput.businessfaxnumber.match(/^\+?([0-9])+$/)) {
				errors['businessfaxnumber'] = 'Invalid fax number';
			}
		}*/

		if (Object.getOwnPropertyNames(errors).length > 0) {
			status = false;
		}

		this.setState({ errors: errors });
		this.props.updateStore({
			...userInput
		});

		return status;
	}

	componentWillMount() {
		if (this.state.privatecountry) {
			this.getOptionState(this.state.privatecountry, 'private');
		}
		if (this.state.privateprovince) {
			this.getOptionCity(this.state.privateprovince, 'private');
		}
		if (this.state.businesscountry) {
			this.getOptionState(this.state.businesscountry, 'business');
		}
		if (this.state.businessprovince) {
			this.getOptionCity(this.state.businessprovince, 'business');
		}
	}

	getOptionState(countrycode = '', type = '') {
		let paging = {
			limit: -1,
			page: 1
		}
		let sort = {
			statename: 'asc'
		};
		let criteria = { countrycode, active: true };
		let url = api.url.state.list;
		let column = [];
		/*loading select2 get data*/
		if (type === 'business') {
			this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, businessprovince: true } }));
		} else {
			this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, privateprovince: true } }));
		}
		var result = RetrieveRequest(url, paging, column, criteria, sort);
		result.then((response) => {
			const { status, result } = response;
			if (status.responsecode.substring(0, 1) === '0') {
				//remapping for base option select2
				var provinces = result.map(obj => {
					var result2 = {};
					result2['label'] = obj.statename;
					result2['value'] = obj.statecode;
					return result2;
				})
				if (type === 'business') {
					this.setState(prevState => ({
						optionsBusinessProvince: provinces,
						businessprovincedisabled: false,
						isLoadingSelect2: { ...prevState.isLoadingSelect2, businessprovince: false }
					}));
				} else {
					this.setState(prevState => ({
						optionsPrivateProvince: provinces,
						privateprovincedisabled: false,
						isLoadingSelect2: { ...prevState.isLoadingSelect2, privateprovince: false }
					}));
				}
			} else {
				Alert.error(status.responsemessage);
			}
		});
	}

	getOptionCity(statecode = '', type = '') {
		let paging = {
			limit: -1,
			page: 1
		}
		let sort = {
			cityname: 'asc'
		};
		let criteria = { statecode, active: true };
		let url = api.url.city.list;
		let column = [];
		/*loading select2 get data*/
		if (type === 'business') {
			this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, businesscity: true } }));
		} else {
			this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, privatecity: true } }));
		}
		var result = RetrieveRequest(url, paging, column, criteria, sort);
		result.then((response) => {
			const { status, result } = response;
			if (status.responsecode.substring(0, 1) === '0') {
				//remapping for base option select2
				var city = result.map(obj => {
					var result2 = {};
					result2['label'] = obj.cityname;
					result2['value'] = obj.citycode;
					return result2;
				})
				if (type === 'business') {
					this.setState(prevState => ({
						optionsBusinessCity: city,
						businesscitydisabled: false,
						isLoadingSelect2: { ...prevState.isLoadingSelect2, businesscity: false }
					}));
				} else {
					this.setState(prevState => ({
						optionsPrivateCity: city,
						privatecitydisabled: false,
						isLoadingSelect2: { ...prevState.isLoadingSelect2, privatecity: false }
					}));
				}
			} else {
				Alert.error(status.responsemessage);
			}
		});
	}

	handlePreferredAddressChange = (event) => {
		let preferredaddress = event === null ? null : event.target.value;
		this.setState({ preferredaddress });
		this.props.selectPreferredAddress(preferredaddress);
	}

	handlePrivateCountryChange = (event) => {
		let privatecountry = event === null ? null : event.value;
		this.setState({ privatecountry, privateprovince: null, privateprovincedisabled: true, optionsPrivateProvince: [], privatecity: null, privatecitydisabled: true, optionsPrivateCity: [] });
		this.props.selectPrivateCountry(privatecountry);
		if (privatecountry) { this.getOptionState(privatecountry, 'private'); }
	}

	handlePrivateProvinceChange = (event) => {
		let privateprovince = event === null ? null : event.value;
		this.setState({ privateprovince, privatecity: null, privatecitydisabled: true, optionsPrivateCity: [] });
		this.props.selectPrivateProvince(privateprovince);
		if (privateprovince) { this.getOptionCity(privateprovince, 'private'); }
	}

	handlePrivateCityChange = (event) => {
		let privatecity = event === null ? null : event.value;
		this.setState({ privatecity });
		this.props.selectPrivateCity(privatecity);
	}

	handleBusinessCountryChange = (event) => {
		let businesscountry = event === null ? null : event.value;
		this.setState({ businesscountry, businessprovince: null, businessprovincedisabled: true, optionsBusinessProvince: [], businesscity: null, businesscitydisabled: true, optionsBusinessCity: [] });
		this.props.selectBusinessCountry(businesscountry);
		if (businesscountry) { this.getOptionState(businesscountry, 'business'); }
	}

	handleBusinessProvinceChange = (event) => {
		let businessprovince = event === null ? null : event.value;
		this.setState({ businessprovince, businesscity: null, businesscitydisabled: true, optionsBusinessCity: [] });
		this.props.selectBusinessProvince(businessprovince);
		if (businessprovince) { this.getOptionCity(businessprovince, 'business'); }
	}

	handleBusinessCityChange = (event) => {
		let businesscity = event === null ? null : event.value;
		this.setState({ businesscity });
		this.props.selectBusinessCity(businesscity);
	}

	handlePrivatePhoneCodeChange = (event) => {
		let privatephonecode = event === null ? null : event.value;
		this.setState({ privatephonecode });
		this.props.selectPrivatePhoneCode(privatephonecode);
	}

	handlePrivateFaxCodeChange = (event) => {
		let privatefaxcode = event === null ? null : event.value;
		this.setState({ privatefaxcode });
		this.props.selectPrivateFaxCode(privatefaxcode);
	}

	handleBusinessPhoneCodeChange = (event) => {
		let businessphonecode = event === null ? null : event.value;
		this.setState({ businessphonecode });
		this.props.selectBusinessPhoneCode(businessphonecode);
	}

	handleBusinessFaxCodeChange = (event) => {
		let businessfaxcode = event === null ? null : event.value;
		this.setState({ businessfaxcode });
		this.props.selectBusinessFaxCode(businessfaxcode);
	}

	handleEmailChange = (event) => {
		let email = event.target === null ? '' : event.target.value;
		this.setState({ email });
		this.props.saveEmail(email);
	}

	handleMobilePhoneNumberChange = (event) => {
		let mobilephonenumber = event.target === null ? '' : event.target.value;
		this.setState({ mobilephonenumber });
		this.props.saveMobilePhoneNumber(mobilephonenumber);
	}

	handleMobilePhoneCodeChange = (event) => {
		let mobilephonecode = event === null ? null : event.value;
		this.setState({ mobilephonecode });
		this.props.selectMobilePhoneCode(mobilephonecode);
	}

	handlePrivateAddressChange = (event) => {
		let privateaddress = event.target === '' ? '' : event.target.value;
		this.setState({ privateaddress });
		this.props.savePrivateAddress(privateaddress);
	}

	handlePrivatePostalCodeChange = (event) => {
		let privatepostalcode = event.target === null ? '' : event.target.value;
		this.setState({ privatepostalcode });
		this.props.savePrivatePostalCode(privatepostalcode);
	}

	handlePrivatePhoneRegionChange = (event) => {
		let privatephoneregion = event.target === null ? '' : event.target.value;
		this.setState({ privatephoneregion });
		this.props.savePrivatePhoneRegion(privatephoneregion);
	}

	handlePrivatePhoneNumberChange = (event) => {
		let privatephonenumber = event.target === null ? '' : event.target.value;
		this.setState({ privatephonenumber });
		this.props.savePrivatePhoneNumber(privatephonenumber);
	}

	handlePrivateFaxRegionChange = (event) => {
		let privatefaxregion = event.target === null ? '' : event.target.value;
		this.setState({ privatefaxregion });
		this.props.savePrivateFaxRegion(privatefaxregion);
	}

	handlePrivateFaxNumberChange = (event) => {
		let privatefaxnumber = event.target === null ? '' : event.target.value;
		this.setState({ privatefaxnumber });
		this.props.savePrivateFaxNumber(privatefaxnumber);
	}

	handleCompanyNameChange = (event) => {
		let companyname = event.target === null ? '' : event.target.value;
		this.setState({ companyname });
		this.props.saveCompanyName(companyname);
	}

	handleDepartmentChange = (event) => {
		let department = event.target === null ? '' : event.target.value;
		this.setState({ department });
		this.props.saveDepartment(department);
	}

	handleBusinessAddressChange = (event) => {
		let businessaddress = event.target === null ? '' : event.target.value;
		this.setState({ businessaddress });
		this.props.saveBusinessAddress(businessaddress);
	}

	handleBusinessPostalCodeChange = (event) => {
		let businesspostalcode = event.target === null ? '' : event.target.value;
		this.setState({ businesspostalcode });
		this.props.saveBusinessPostalCode(businesspostalcode);
	}

	handleBusinessPhoneRegionChange = (event) => {
		let businessphoneregion = event.target === null ? '' : event.target.value;
		this.setState({ businessphoneregion });
		this.props.saveBusinessPhoneRegion(businessphoneregion);
	}

	handleBusinessPhoneNumberChange = (event) => {
		let businessphonenumber = event.target === null ? '' : event.target.value;
		this.setState({ businessphonenumber });
		this.props.saveBusinessPhoneNumber(businessphonenumber);
	}

	handleBusinessFaxRegionChange = (event) => {
		let businessfaxregion = event.target === null ? '' : event.target.value;
		this.setState({ businessfaxregion });
		this.props.saveBusinessFaxRegion(businessfaxregion);
	}

	handleBusinessFaxNumberChange = (event) => {
		let businessfaxnumber = event.target === null ? '' : event.target.value;
		this.setState({ businessfaxnumber });
		this.props.saveBusinessFaxNumber(businessfaxnumber);
	}

	render() {
		// const {
		// 	isLoadingSelect2,
		// 	preferredaddress,
		// 	email, mobilephonenumber,
		// 	privateaddress, privatepostalcode, privatephoneregion, privatephonenumber, privatefaxregion, privatefaxnumber,
		// 	companyname, department, businessaddress, businesspostalcode, businessphoneregion, businessphonenumber, businessfaxregion, businessfaxnumber,
		// 	optionsCountry, privatecountry, businesscountry,
		// 	optionsPrivateProvince, privateprovince, privateprovincedisabled,
		// 	optionsBusinessProvince, businessprovince, businessprovincedisabled,
		// 	optionsPrivateCity, privatecity, privatecitydisabled,
		// 	optionsBusinessCity, businesscity, businesscitydisabled,
		// 	optionsPhoneCode, mobilephonecode, privatephonecode, privatefaxcode, businessphonecode, businessfaxcode
		// } = this.state;
		const {
			isLoadingSelect2,
			preferredaddress,
			email, mobilephonenumber,
			privateaddress, privatepostalcode, privatephoneregion, privatephonenumber,
			companyname, department, businessaddress, businesspostalcode, businessphoneregion, businessphonenumber,
			optionsCountry, privatecountry, businesscountry,
			optionsPrivateProvince, privateprovince, privateprovincedisabled,
			optionsBusinessProvince, businessprovince, businessprovincedisabled,
			optionsPrivateCity, privatecity, privatecitydisabled,
			optionsBusinessCity, businesscity, businesscitydisabled,
			optionsPhoneCode, mobilephonecode, privatephonecode, businessphonecode
		} = this.state;
		return (
			<div className="member-enroll">
				<div className="content-title flex-hr mb-0 title-description">
					<h3 className="title-has-control mt-2">Address & Contact</h3>
				</div>
				<hr className="mt-0" />
				<div className="row">
					<div className="col">
						<form className="clearfix position-relative" autoComplete="off">
							<div className="row">
								<div className="col-md-6">
									<div className="form-group row">
										<label className="col-sm-4 col-form-label" htmlFor="email-view">Email Address </label>
										<div className="col-sm-8">
											<input className="form-control" type="text" id="email-view" ref="email" maxLength="45" value={email} onChange={this.handleEmailChange} />
											<span className="text-danger">{this.state.errors["email"]}</span>
										</div>
									</div>
									<div className="form-group row">
										<label className="col-sm-4 col-form-label">Mobile Phone</label>
										<div className="col-sm-8">
											<div className="row">
												<div className="col">
													<div className="row">
														<label className="col-sm-12 col-form-label" htmlFor="mobilephonecode-view">Country Code </label>
														<div className="col-sm-12">
															<Select2 reference="mobilephonecode" className="reactSelect2" id="mobilephonecode-view" options={optionsPhoneCode} onChange={this.handleMobilePhoneCodeChange} value={optionsPhoneCode.filter(({ value }) => value === mobilephonecode)} isLoading={isLoadingSelect2.phonecode}></Select2>
															<span className="text-danger">{this.state.errors["mobilephonecode"]}</span>
														</div>
													</div>
												</div>
												<div className="col">
													<div className="row">
														<label className="col-sm-12 col-form-label" htmlFor="mobilephonenumber-view">Number </label>
														<div className="col-sm-12">
															<input className="form-control" type="text" id="mobilephonenumber-view" ref="mobilephonenumber" maxLength="20" value={mobilephonenumber} onChange={this.handleMobilePhoneNumberChange} placeholder="ex. 8123456789" />
															<span className="text-danger">{this.state.errors["mobilephonenumber"]}</span>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="form-group row">
										<label className="col-sm-4 col-form-label">Preferred Address</label>
										<div className="col-sm-8">
											<div className="radio-group mt-2">
												<div className="rdio rdio-primary radio-inline">
													<input name="preferredaddress" value="Private" id="address1" type="radio" tabIndex="-1" onChange={this.handlePreferredAddressChange} checked={preferredaddress === 'Private'} />
													<label htmlFor="address1">Private</label>
												</div>
												<div className="rdio rdio-primary radio-inline">
													<input name="preferredaddress" value="Business" id="address2" type="radio" tabIndex="-1" onChange={this.handlePreferredAddressChange} checked={preferredaddress === 'Business'} />
													<label htmlFor="address2">Business</label>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-md-6">
									<div className="content-title flex-hr mb-0 title-description">
										<h3 className="title-has-control mt-2">Private</h3>
									</div>
									<hr className="mt-0" />
									<div className="form-group row">
										<label className="col-sm-4 col-form-label" htmlFor="privateaddress-view">Address <p style={{ color: 'grey' }}><i>(optional)</i></p></label>
										<div className="col-sm-8">
											<textarea rows="3" className="form-control" type="text" id="privateaddress-view" ref="privateaddress" maxLength="255" value={privateaddress} onChange={this.handlePrivateAddressChange} />
											<span className="text-danger">{this.state.errors["privateaddress"]}</span>
										</div>
									</div>
									<div className="form-group row">
										<label className="col-sm-4 col-form-label" htmlFor="privatecountry-view">Country </label>
										<div className="col-sm-8">
											<Select2 reference="privatecountry" className="reactSelect2" id="privatecountry-view" options={optionsCountry} onChange={this.handlePrivateCountryChange} value={optionsCountry.filter(({ value }) => value === privatecountry)} isLoading={isLoadingSelect2.countrycode}></Select2>
											<span className="text-danger">{this.state.errors["privatecountry"]}</span>
										</div>
									</div>
									<div className="form-group row">
										<label className="col-sm-4 col-form-label" htmlFor="privateprovince-view">Province </label>
										<div className="col-sm-8">
											<Select2 reference="privateprovince" className="reactSelect2" id="privateprovince-view" options={optionsPrivateProvince} onChange={this.handlePrivateProvinceChange} value={optionsPrivateProvince.filter(({ value }) => value === privateprovince)} disabled={privateprovincedisabled} isLoading={isLoadingSelect2.privateprovince}></Select2>
											<span className="text-danger">{this.state.errors["privateprovince"]}</span>
										</div>
									</div>
									<div className="form-group row">
										<label className="col-sm-4 col-form-label" htmlFor="privatecity-view">City </label>
										<div className="col-sm-8">
											<Select2 reference="privatecity" className="reactSelect2" id="privatecity" options={optionsPrivateCity} onChange={this.handlePrivateCityChange} value={optionsPrivateCity.filter(({ value }) => value === privatecity)} disabled={privatecitydisabled} isLoading={isLoadingSelect2.privatecity}></Select2>
											<span className="text-danger">{this.state.errors["privatecity"]}</span>
										</div>
									</div>
									<div className="form-group row">
										<label className="col-sm-4 col-form-label" htmlFor="privatepostalcode-view">Postal Code <p style={{ color: 'grey' }}><i>(optional)</i></p></label>
										<div className="col-sm-8">
											<input className="form-control" type="text" id="privatepostalcode-view" ref="privatepostalcode" maxLength="5" value={privatepostalcode} onChange={this.handlePrivatePostalCodeChange} />
											<span className="text-danger">{this.state.errors["privatepostalcode"]}</span>
										</div>
									</div>
									<div className="form-group row">
										<label className="col-sm-12 col-form-label">Phone {(privatephonecode || privatephoneregion || privatephonenumber) ? "" : <p style={{ color: 'grey' }}><i>(optional)</i></p>}</label>
										<div className="col-sm-12">
											<div className="row">
												<div className="col-lg-6">
													<div className="row">
														<label className="col-sm-12 col-form-label" htmlFor="privatephonecode-view">Country</label>
														<div className="col-sm-12">
															<Select2 reference="privatephonecode" className="reactSelect2" id="privatephonecode-view" options={optionsPhoneCode} onChange={this.handlePrivatePhoneCodeChange} value={optionsPhoneCode.filter(({ value }) => value === privatephonecode)} isLoading={isLoadingSelect2.phonecode}></Select2>
															<span className="text-danger">{this.state.errors["privatephonecode"]}</span>
														</div>
													</div>
												</div>
												<div className="col-lg-2">
													<div className="row">
														<label className="col-sm-12 col-form-label" htmlFor="privatephoneregion-view">Region</label>
														<div className="col-sm-12">
															<input className="form-control" type="text" id="privatephoneregion-view" ref="privatephoneregion" maxLength="3" value={privatephoneregion} onChange={this.handlePrivatePhoneRegionChange} placeholder="ex. 21" />
															<span className="text-danger">{this.state.errors["privatephoneregion"]}</span>
														</div>
													</div>
												</div>
												<div className="col-lg-4">
													<div className="row">
														<label className="col-sm-12 col-form-label" htmlFor="privatephonenumber-view">Number</label>
														<div className="col-sm-12">
															<input className="form-control" type="text" id="privatephonenumber-view" ref="privatephonenumber" maxLength="20" value={privatephonenumber} onChange={this.handlePrivatePhoneNumberChange} placeholder="ex. 8123456789" />
															<span className="text-danger">{this.state.errors["privatephonenumber"]}</span>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
									{/* <div className="form-group row">
										<label className="col-sm-12 col-form-label">Fax</label>
										<div className="col-sm-12">
											<div className="row">
												<div className="col-lg-6">
													<div className="row">
														<label className="col-sm-12 col-form-label" htmlFor="privatefaxcode-view">Country</label>
														<div className="col-sm-12">
															<Select2 reference="privatefaxcode" className="reactSelect2" id="privatefaxcode-view" options={optionsPhoneCode} onChange={this.handlePrivateFaxCodeChange} value={optionsPhoneCode.filter(({ value }) => value === privatefaxcode)} isLoading={isLoadingSelect2.phonecode}></Select2>
															<span className="text-danger">{this.state.errors["privatefaxcode"]}</span>
														</div>
													</div>
												</div>
												<div className="col-lg-2">
													<div className="row">
														<label className="col-sm-12 col-form-label" htmlFor="privatefaxregion-view">Region</label>
														<div className="col-sm-12">
															<input className="form-control" type="text" id="privatefaxregion-view" ref="privatefaxregion" maxLength="5" value={privatefaxregion} onChange={this.handlePrivateFaxRegionChange} />
															<span className="text-danger">{this.state.errors["privatefaxregion"]}</span>
														</div>
													</div>
												</div>
												<div className="col-lg-4">
													<div className="row">
														<label className="col-sm-12 col-form-label" htmlFor="privatefaxnumber-view">Number</label>
														<div className="col-sm-12">
															<input className="form-control" type="text" id="privatefaxnumber-view" ref="privatefaxnumber" maxLength="20" value={privatefaxnumber} onChange={this.handlePrivateFaxNumberChange} placeholder="ex. 08123456789" />
															<span className="text-danger">{this.state.errors["privatefaxnumber"]}</span>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div> */}
								</div>
								<div className="col-md-6">
									<div className="content-title flex-hr mb-0 title-description">
										<h3 className="title-has-control mt-2">Business</h3>
									</div>
									<hr className="mt-0" />
									<div className="form-group row">
										<label className="col-sm-4 col-form-label" htmlFor="companyname-view">Company Name  {(preferredaddress === 'Business') ? "" : <p style={{ color: 'grey' }}><i>(optional)</i></p>}</label>
										<div className="col-sm-8">
											<input className="form-control" type="text" id="companyname-view" ref="companyname" maxLength="45" value={companyname} onChange={this.handleCompanyNameChange} />
											<span className="text-danger">{this.state.errors["companyname"]}</span>
										</div>
									</div>
									<div className="form-group row">
										<label className="col-sm-4 col-form-label" htmlFor="department-view">Department  {(preferredaddress === 'Business') ? "" : <p style={{ color: 'grey' }}><i>(optional)</i></p>}</label>
										<div className="col-sm-8">
											<input className="form-control" type="text" id="department-view" ref="department" maxLength="45" value={department} onChange={this.handleDepartmentChange} />
											<span className="text-danger">{this.state.errors["department"]}</span>
										</div>
									</div>
									<div className="form-group row">
										<label className="col-sm-4 col-form-label" htmlFor="businessaddress-view">Address <p style={{ color: 'grey' }}><i>(optional)</i></p></label>
										<div className="col-sm-8">
											<textarea rows="3" className="form-control" type="text" id="businessaddress-view" ref="businessaddress" maxLength="255" value={businessaddress} onChange={this.handleBusinessAddressChange} />
											<span className="text-danger">{this.state.errors["businessaddress"]}</span>
										</div>
									</div>
									<div className="form-group row">
										<label className="col-sm-4 col-form-label" htmlFor="businesscountry-view">Country {(preferredaddress === 'Business') ? "" : <p style={{ color: 'grey' }}><i>(optional)</i></p>}</label>
										<div className="col-sm-8">
											<Select2 reference="businesscountry" className="reactSelect2" id="businesscountry-view" options={optionsCountry} onChange={this.handleBusinessCountryChange} value={optionsCountry.filter(({ value }) => value === businesscountry)} isLoading={isLoadingSelect2.countrycode}></Select2>
											<span className="text-danger">{this.state.errors["businesscountry"]}</span>
										</div>
									</div>
									<div className="form-group row">
										<label className="col-sm-4 col-form-label" htmlFor="businessprovince-view">Province {(preferredaddress === 'Business') ? "" : <p style={{ color: 'grey' }}><i>(optional)</i></p>}</label>
										<div className="col-sm-8">
											<Select2 reference="businessprovince" className="reactSelect2" id="businessprovince-view" options={optionsBusinessProvince} onChange={this.handleBusinessProvinceChange} value={optionsBusinessProvince.filter(({ value }) => value === businessprovince)} disabled={businessprovincedisabled} isLoading={isLoadingSelect2.businessprovince}></Select2>
											<span className="text-danger">{this.state.errors["businessprovince"]}</span>
										</div>
									</div>
									<div className="form-group row">
										<label className="col-sm-4 col-form-label" htmlFor="businesscity-view">City {(preferredaddress === 'Business') ? "" : <p style={{ color: 'grey' }}><i>(optional)</i></p>}</label>
										<div className="col-sm-8">
											<Select2 reference="businesscity" className="reactSelect2" id="businesscity-view" options={optionsBusinessCity} onChange={this.handleBusinessCityChange} value={optionsBusinessCity.filter(({ value }) => value === businesscity)} disabled={businesscitydisabled} isLoading={isLoadingSelect2.businesscity}></Select2>
											<span className="text-danger">{this.state.errors["businesscity"]}</span>
										</div>
									</div>
									<div className="form-group row">
										<label className="col-sm-4 col-form-label" htmlFor="businesspostalcode-view">Postal Code <p style={{ color: 'grey' }}><i>(optional)</i></p></label>
										<div className="col-sm-8">
											<input className="form-control" type="text" id="businesspostalcode-view" ref="businesspostalcode" maxLength="5" value={businesspostalcode} onChange={this.handleBusinessPostalCodeChange} />
											<span className="text-danger">{this.state.errors["businesspostalcode"]}</span>
										</div>
									</div>
									<div className="form-group row">
										<label className="col-sm-12 col-form-label">Phone {(businessphonecode || businessphoneregion || businessphonenumber) ? "" : <p style={{ color: 'grey' }}><i>(optional)</i></p>}</label>
										<div className="col-sm-12">
											<div className="row">
												<div className="col-lg-6">
													<div className="row">
														<label className="col-sm-12 col-form-label" htmlFor="businessphonecode-view">Country</label>
														<div className="col-sm-12">
															<Select2 reference="businessphonecode" className="reactSelect2" id="businessphonecode-view" options={optionsPhoneCode} onChange={this.handleBusinessPhoneCodeChange} value={optionsPhoneCode.filter(({ value }) => value === businessphonecode)} isLoading={isLoadingSelect2.phonecode}></Select2>
															<span className="text-danger">{this.state.errors["businessphonecode"]}</span>
														</div>
													</div>
												</div>
												<div className="col-lg-2">
													<div className="row">
														<label className="col-sm-12 col-form-label" htmlFor="businessphoneregion-view">Region</label>
														<div className="col-sm-12">
															<input className="form-control" type="text" id="businessphoneregion-view" ref="businessphoneregion" maxLength="3" value={businessphoneregion} onChange={this.handleBusinessPhoneRegionChange} placeholder="ex. 21" />
															<span className="text-danger">{this.state.errors["businessphoneregion"]}</span>
														</div>
													</div>
												</div>
												<div className="col-lg-4">
													<div className="row">
														<label className="col-sm-12 col-form-label" htmlFor="businessphonenumber-view">Number</label>
														<div className="col-sm-12">
															<input className="form-control" type="text" id="businessphonenumber-view" ref="businessphonenumber" maxLength="20" value={businessphonenumber} onChange={this.handleBusinessPhoneNumberChange} placeholder="ex. 8123456789" />
															<span className="text-danger">{this.state.errors["businessphonenumber"]}</span>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
									{/* <div className="form-group row">
										<label className="col-sm-12 col-form-label">Fax</label>
										<div className="col-sm-12">
											<div className="row">
												<div className="col-lg-6">
													<div className="row">
														<label className="col-sm-12 col-form-label" htmlFor="businessfaxcode-view">Country</label>
														<div className="col-sm-12">
															<Select2 reference="businessfaxcode" className="reactSelect2" id="businessfaxcode-view" options={optionsPhoneCode} onChange={this.handleBusinessFaxCodeChange} value={optionsPhoneCode.filter(({ value }) => value === businessfaxcode)} isLoading={isLoadingSelect2.phonecode}></Select2>
															<span className="text-danger">{this.state.errors["businessfaxcode"]}</span>
														</div>
													</div>
												</div>
												<div className="col-lg-2">
													<div className="row">
														<label className="col-sm-12 col-form-label" htmlFor="businessfaxregion-view">Region</label>
														<div className="col-sm-12">
															<input className="form-control" type="text" id="businessfaxregion-view" ref="businessfaxregion" maxLength="5" value={businessfaxregion} onChange={this.handleBusinessFaxRegionChange} />
															<span className="text-danger">{this.state.errors["businessfaxregion"]}</span>
														</div>
													</div>
												</div>
												<div className="col-lg-4">
													<div className="row">
														<label className="col-sm-12 col-form-label" htmlFor="businessfaxnumber-view">Number</label>
														<div className="col-sm-12">
															<input className="form-control" type="text" id="businessfaxnumber-view" ref="businessfaxnumber" maxLength="20" defaultValue={businessfaxnumber} onChange={this.handleBusinessFaxNumberChange} placeholder="ex. 08123456789" />
															<span className="text-danger">{this.state.errors["businessfaxnumber"]}</span>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div> */}
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		)
	}
}