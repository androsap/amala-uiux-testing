import React, { Component } from 'react';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';
import Datepicker from '../../components/Datepicker';
import Select2 from '../../components/Select2';
import Alert from '../../components/Alert';
import { getOptionsNameOnCard, getGeneralConfig } from '../../utilities/Helpers';
import { general_config } from '../../utilities/Constant';

export default class Layout extends Component {
	constructor(props) {
		super(props);
		this.state = {
			errors: {},
			optionsSalutation: [],
			optionsTitle: [],
			optionsNationality: [],
			optionsReligion: [],
			optionsLanguage: [],
			optionsNameOnCard: [],
			salutation: props.enrollment.salutation,
			title: props.enrollment.title,
			firstname: props.enrollment.firstname,
			lastname: props.enrollment.lastname,
			nameoncard: props.enrollment.nameoncard,
			selectednameoncard: props.enrollment.selectednameoncard,
			gender: props.enrollment.gender,
			birthdate: props.enrollment.birthdate,
			minbirthdate: props.enrollment.minbirthdate,
			maxbirthdate: props.enrollment.maxbirthdate,
			nationality: props.enrollment.nationality,
			religion: props.enrollment.religion,
			language: props.enrollment.language,
			passportno: props.enrollment.passportno,
			idcardno: props.enrollment.idcardno,
			genderlist: props.enrollment.genderlist,
			customnameoncard: props.enrollment.customnameoncard,
			isLoadingSelect2: {
				salutation: false,
				title: false,
				nationality: false,
				religion: false,
				language: false
			}
		};
	}

	componentWillMount() {
		const { firstname, lastname, customnameoncard } = this.props.enrollment;

		if (firstname || lastname) {
			var optionsNameOnCard = getOptionsNameOnCard(firstname, lastname, customnameoncard);
			this.setState({ optionsNameOnCard });
		}

		//if language null, set default
		if (this.props.enrollment.language === null) {
			getGeneralConfig(general_config.default_language).then((language) => {
				this.setState({ language });
				this.props.selectLanguage(language);
			});
		}

		//if language null, set default
		if (this.props.enrollment.nationality === null) {
			getGeneralConfig(general_config.default_nationality).then((countrycode) => {
				let url = api.url.country.list;
				let paging = {};
				let column = [];
				let criteria = { countrycode };
				let sort = {};
				RetrieveRequest(url, paging, column, criteria, sort).then((response) => {
					const { status, result } = response;
					var nationality = null;
					if (status.responsecode.substring(0, 1) === '0') {
						nationality = (result[0].nationality !== undefined) ? result[0].nationality : '';
					}
					this.setState({ nationality });
					this.props.selectNationality(nationality);
				});
			});
		}
	}

	componentDidMount() {
		this.getOptionsSalutation();
		this.getOptionsTitle();
		this.getOptionsNationality();
		this.getOptionsReligion();
		this.getOptionsLanguage();
	}

	getOptionsSalutation() {
		let paging = {
			limit: -1,
			page: 1
		}
		let sort = {
			salutationname: 'asc'
		};
		let criteria = {
			active: true
		};
		let url = api.url.salutation.list;
		let column = [];
		/*loading select2 get data*/
		this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, salutation: true } }));
		var result = RetrieveRequest(url, paging, column, criteria, sort);
		result.then((response) => {
			const { status, result } = response;
			if (status.responsecode.substring(0, 1) === '0') {
				//remapping for base option select2
				var optionsSalutation = result.map(obj => {
					var result2 = {};
					result2['label'] = obj.salutationname;
					result2['value'] = obj.salutationcode;
					return result2;
				})

				this.setState(prevState => ({
					optionsSalutation,
					isLoadingSelect2: { ...prevState.isLoadingSelect2, salutation: false }
				}));
			} else {
				Alert.error(status.responsemessage);
			}
		});
	}

	getOptionsTitle() {
		let paging = {
			limit: -1,
			page: 1
		}
		let sort = {
			titlename: 'asc'
		};
		let criteria = {
			active: true
		};
		let url = api.url.title.list;
		let column = [];
		/*loading select2 get data*/
		this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, title: true } }));
		var result = RetrieveRequest(url, paging, column, criteria, sort);
		result.then((response) => {
			const { status, result } = response;
			if (status.responsecode.substring(0, 1) === '0') {
				//remapping for base option select2
				var optionsTitle = result.map(obj => {
					var result2 = {};
					result2['label'] = obj.titlename;
					result2['value'] = obj.titlecode;
					return result2;
				})


				this.setState(prevState => ({
					optionsTitle,
					isLoadingSelect2: { ...prevState.isLoadingSelect2, title: false }
				}));
			} else {
				Alert.error(status.responsemessage);
			}
		});
	}

	getOptionsNationality() {
		let paging = {
			limit: -1,
			page: 1
		}
		let sort = {
			nationality: 'asc'
		};
		let criteria = {
			active: true
		};
		let url = api.url.country.list;
		let column = [];
		/*loading select2 get data*/
		this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, nationality: true } }));
		var result = RetrieveRequest(url, paging, column, criteria, sort);
		result.then((response) => {
			const { status, result } = response;
			if (status.responsecode.substring(0, 1) === '0') {
				//remapping for base option select2
				var optionsNationality = result.map(obj => {
					var result2 = {};
					result2['label'] = obj.nationality;
					result2['value'] = obj.nationality;
					return result2;
				})


				this.setState(prevState => ({
					optionsNationality,
					isLoadingSelect2: { ...prevState.isLoadingSelect2, nationality: false }
				}));
			} else {
				Alert.error(status.responsemessage);
			}
		});
	}

	getOptionsReligion() {
		let paging = {
			limit: -1,
			page: 1
		}
		let sort = {
			religionname: 'asc'
		};
		let criteria = {
			active: true
		};
		let url = api.url.religion.list;
		let column = [];
		/*loading select2 get data*/
		this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, religion: true } }));
		var result = RetrieveRequest(url, paging, column, criteria, sort);
		result.then((response) => {
			const { status, result } = response;
			if (status.responsecode.substring(0, 1) === '0') {
				//remapping for base option select2
				var optionsReligion = result.map(obj => {
					var result2 = {};
					result2['label'] = obj.religionname;
					result2['value'] = obj.religionid;
					return result2;
				})


				this.setState(prevState => ({
					optionsReligion,
					isLoadingSelect2: { ...prevState.isLoadingSelect2, religion: false }
				}));
			} else {
				Alert.error(status.responsemessage);
			}
		});
	}

	getOptionsLanguage() {
		let paging = {
			limit: -1,
			page: 1
		}
		let sort = {
			langname: 'asc'
		};
		let criteria = {
			active: true
		};
		let url = api.url.language.list;
		let column = [];
		/*loading select2 get data*/
		this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, language: true } }));
		var result = RetrieveRequest(url, paging, column, criteria, sort);
		result.then((response) => {
			const { status, result } = response;
			if (status.responsecode.substring(0, 1) === '0') {
				//remapping for base option select2
				var optionsLanguage = result.map(obj => {
					var result2 = {};
					result2['label'] = obj.langname;
					result2['value'] = obj.langcode;
					return result2;
				})


				this.setState(prevState => ({
					optionsLanguage,
					isLoadingSelect2: { ...prevState.isLoadingSelect2, language: false }
				}));
			} else {
				Alert.error(status.responsemessage);
			}
		});
	}

	_grabUserInput() {
		return {
			salutation: this.state.salutation,
			title: this.state.title,
			firstname: this.refs.firstname.value,
			// middlename: this.refs.middlename.value,
			lastname: this.refs.lastname.value,
			// nameoncard: this.refs.nameoncard.value,
			nameoncard: this.state.nameoncard,
			gender: this.state.gender,
			birthdate: this.state.birthdate,
			nationality: this.state.nationality,
			religion: this.state.religion,
			language: this.state.language,
			passportno: this.refs.passportno.value,
			idcardno: this.refs.idcardno.value,
		};
	}

	isValidated = () => {
		let errors = {};
		let status = true;
		const userInput = this._grabUserInput();

		/*//salutation
		if (!userInput.salutation) {
			errors['salutation'] = 'Required';
		}*/

		//firstname
		if (!userInput.firstname) {
			errors['firstname'] = 'Required';
		} else if (!userInput.firstname.match(/^[a-zA-Z\s]+$/)) {
			errors['firstname'] = 'Only letters and space';
		} else if (userInput.firstname.length > 45) {
			errors['firstname'] = 'Maximum 45 characters';
		}

		//lastname
		if (userInput.lastname && !userInput.lastname.match(/^[a-zA-Z]+$/)) {
			errors['lastname'] = 'Only letters';
		}

		//name on card
		if (!userInput.nameoncard) {
			errors['nameoncard'] = 'Required';
		} else if (!userInput.nameoncard.match(/^[a-zA-Z\s]+$/)) {
			errors['nameoncard'] = 'Only letters and space';
		} else if (userInput.nameoncard.length > 24) {
			errors['nameoncard'] = 'Maximum 24 characters';
		}

		//birthdate
		const { minbirthdate, maxbirthdate } = this.state;
		if (!userInput.birthdate) {
			errors['birthdate'] = 'Required';
		} else if (userInput.birthdate > minbirthdate || userInput.birthdate < maxbirthdate) {
			errors['birthdate'] = 'Invalid';
		} else if (userInput.birthdate.length > 10) {
			errors['birthdate'] = 'Maximum 10 characters';
		}

		//nationality
		if (!userInput.nationality) {
			errors['nationality'] = 'Required';
		}

		/*//religion
		if (!userInput.religion) {
			errors['religion'] = 'Required';
		}*/

		//language
		if (!userInput.language) {
			errors['language'] = 'Required';
		}

		//passport no
		if (userInput.passportno) {
			if (!userInput.passportno.match(/^[0-9a-zA-Z\s-.]+$/)) {
				errors['passportno'] = 'Only alphanumeric, space, "-" and "."';
			} else if (userInput.passportno.length > 45) {
				errors['passportno'] = 'Maximum 45 characters';
			}
		}

		//ID card no
		if (userInput.idcardno) {
			// if (!userInput.idcardno.match(/^[0-9a-zA-Z\s-.]+$/)) {
			if (!userInput.idcardno.match(/^[0-9]+$/)) {
				// errors['idcardno'] = 'Only alphanumeric, space, "-" and "."';
				errors['idcardno'] = 'Only numeric';
			} else if (userInput.idcardno.length > 45) {
				errors['idcardno'] = 'Maximum 45 characters';
			}
		}

		if (Object.getOwnPropertyNames(errors).length > 0) {
			status = false;
		}

		this.setState({ errors: errors });
		this.props.updateStore({
			...userInput
		});

		return status;
	}

	handleSalutationChange = (event) => {
		let salutation = event === null ? null : event.value;
		this.setState({ salutation });
		this.props.selectSalutation(salutation);
	}

	handleTitleChange = (event) => {
		let title = event === null ? null : event.value;
		this.setState({ title });
		this.props.selectTitle(title);
	}

	handleGenderChange = (event) => {
		let gender = event === null ? null : event.target.value;
		this.setState({ gender });
		this.props.selectGender(gender);
	}

	handleBirthDateChange = (event) => {
		let birthdate = event === null ? null : event;
		this.setState({ birthdate });
		this.props.selectDateOfBirth(birthdate);
	}

	handleNationalityChange = (event) => {
		let nationality = event === null ? null : event.value;
		this.setState({ nationality });
		this.props.selectNationality(nationality);
	}

	handleReligionChange = (event) => {
		let religion = event === null ? null : event.value;
		this.setState({ religion });
		this.props.selectReligion(religion);
	}

	handleLanguageChange = (event) => {
		let language = event === null ? null : event.value;
		this.setState({ language });
		this.props.selectLanguage(language);
	}

	handleFirstNameChange = (event) => {
		const { lastname, customnameoncard } = this.state;
		let firstname = event.target.value ? event.target.value : '';
		let selectednameoncard = null;
		let nameoncard = null;
		this.props.saveFirstName(firstname);

		var optionsNameOnCard = getOptionsNameOnCard(firstname, lastname, customnameoncard);
		this.setState({ firstname, selectednameoncard, nameoncard, optionsNameOnCard });
	}

	handleLastNameChange = (event) => {
		const { firstname, customnameoncard } = this.state;
		let lastname = event.target.value ? event.target.value : '';
		let selectednameoncard = null;
		let nameoncard = null;
		this.props.saveLastName(lastname);

		var optionsNameOnCard = getOptionsNameOnCard(firstname, lastname, customnameoncard);
		this.setState({ lastname, selectednameoncard, nameoncard, optionsNameOnCard });
	}

	handleMiddleNameChange = (event) => {
		this.setState({ middlename: event.target.value });
		this.props.updateStore({ middlename: event.target.value });
	}

	handlePassportNoChange = (event) => {
		let passportno = event.target.value ? event.target.value : '';
		this.setState({ passportno });
		this.props.savePassportNumber(passportno);
	}

	handleIdCardNoChange = (event) => {
		let idcardno = event.target.value ? event.target.value : '';
		this.setState({ idcardno });
		this.props.saveIdCardNumber(idcardno);
	}

	handleNameOnCardChange = (event) => {
		/*let selectednameoncard = event.target === null ? '' : event.target.id;
		let splitselected = selectednameoncard.split("-");
		let { optionsNameOnCard } = this.state;
		let nameoncard = optionsNameOnCard[splitselected[1]];
		this.setState({ selectednameoncard, nameoncard });
		this.props.saveNameOnCard(nameoncard);
		this.props.selectNameOnCard(selectednameoncard);*/
	}

	handleNameOnCardChange = (event) => {
		let selectednameoncard = event.target === null ? '' : Number.parseInt(event.target.value, 0);
		this.setState({ selectednameoncard });

		const { optionsNameOnCard, customnameoncard } = this.state;
		let nameoncard = null;
		if (optionsNameOnCard[selectednameoncard] === null) {
			nameoncard = customnameoncard;
		} else {
			nameoncard = (optionsNameOnCard[selectednameoncard]) ? optionsNameOnCard[selectednameoncard] : null;
		}

		this.setState({ selectednameoncard, nameoncard });
		this.props.saveNameOnCard(nameoncard);
		this.props.selectNameOnCard(selectednameoncard);
	}

	/*handleCustomNameOnCardChange = (event) => {
		let customnameoncardid = event.target.value ? event.target.id : '';
		let customnameoncard = event.target.value ? event.target.value : '';
		this.setState({ customnameoncard });
		this.props.saveCustomNameOnCard(customnameoncard);

		//onchange custom name on card add on array optionsNameOnCard
		let { firstname, lastname } = this.state;
		var optionsNameOnCard = getOptionsNameOnCard(firstname, lastname, customnameoncard);
		this.setState({ optionsNameOnCard });

		let { selectednameoncard } = this.state;
		if (selectednameoncard === customnameoncardid) {
			let nameoncard = customnameoncard;
			this.setState({ nameoncard });
		}
	}*/

	handleCustomNameOnCardChange = (event) => {
		let customnameoncardid = event.target === null ? '' : Number.parseInt(event.target.id, 0);
		let customnameoncard = event.target.value ? event.target.value : '';
		this.setState({ customnameoncard });
		this.props.saveCustomNameOnCard(customnameoncard);

		/* onchange custom name on card add on array optionsNameOnCard */
		let { firstname, lastname } = this.state;
		var optionsNameOnCard = getOptionsNameOnCard(firstname, lastname, customnameoncard);
		this.setState({ optionsNameOnCard });

		let { selectednameoncard } = this.state;
		if (selectednameoncard === customnameoncardid) {
			let nameoncard = customnameoncard;
			this.setState({ nameoncard });
			this.props.saveNameOnCard(nameoncard);
		}
	}

	render() {
		const { isLoadingSelect2, optionsSalutation, salutation, optionsTitle, title, firstname, lastname,
			genderlist, gender, birthdate, minbirthdate, maxbirthdate, optionsNationality, nationality, optionsReligion, religion, optionsLanguage, language,
			passportno, idcardno, optionsNameOnCard, customnameoncard, selectednameoncard
		} = this.state;

		const genderlistdata =
			genderlist.map((data, key) =>
				<div className="col-sm-4" key={key}>
					<label htmlFor={"gender" + key}><input name="gender" id={"gender" + key} tabIndex="-1" value={data.value} type="radio" onChange={this.handleGenderChange} checked={gender === data.value} /> {data.label}</label>
				</div>
			);

		/*var nameoncarddata = '';
		if (optionsNameOnCard.length) {
			nameoncarddata = optionsNameOnCard.map((val, key) =>
				(key !== 4) ?
					<label className="col-sm-12 col-form-label" htmlFor={val + "-" + key} key={val + "-" + key}>
						<input name="nameoncard" value={val} id={"nameoncard-" + key} type="radio" onChange={this.handleNameOnCardChange} checked={selectednameoncard === "nameoncard-" + key} />
						&nbsp;{val}
					</label>
					:
					<label className="col-sm-12 col-form-label form-inline" htmlFor="" key="">
						<input name="nameoncard" value={customnameoncard} id={"nameoncard-" + key} type="radio" onChange={this.handleNameOnCardChange} checked={selectednameoncard === "nameoncard-" + key} />
						&nbsp;<input className="form-control" type="text" id={"nameoncard-" + key} ref="customnameoncard" maxLength="45" value={customnameoncard} onChange={this.handleCustomNameOnCardChange} />
					</label>
			)
		}*/

		var nameoncarddata = '';
		if (optionsNameOnCard.length) {
			nameoncarddata = optionsNameOnCard.map((val, key) =>
				(key !== 4) ?
					<label className="col-sm-12 col-form-label" htmlFor={val + "-" + key} key={val + "-" + key}>
						<input name="nameoncard" value={key} id={"nameoncard-" + key} type="radio" onChange={this.handleNameOnCardChange} checked={selectednameoncard === key} />
						&nbsp;{val}
					</label>
					:
					<label className="col-sm-12 col-form-label form-inline" htmlFor="" key="">
						<input name="nameoncard" value={key} id={"nameoncard-" + key} type="radio" onChange={this.handleNameOnCardChange} checked={selectednameoncard === key} />
						&nbsp;<input className="form-control" type="text" id={key} ref="customnameoncard" maxLength="45" value={customnameoncard} onChange={this.handleCustomNameOnCardChange} />
					</label>
			)
		}
		return (
			<div className="member-enroll">
				<div className="content-title flex-hr mb-0 title-description">
					<h3 className="title-has-control mt-2">Personal Information</h3>
				</div>
				<hr className="mt-0" />
				<div className="row">
					<div className="col">
						<form className="clearfix position-relative" autoComplete="off">
							<div className="row">
								<div className="col-md-6">
									<div className="form-group row">
										<label className="col-sm-4 col-form-label" htmlFor="salutation-view">Salutation <p style={{ color: 'grey' }}><i>(optional)</i></p></label>
										<div className="col-sm-8">
											<Select2 reference="salutation" className="reactSelect2" id="salutation-view" options={optionsSalutation} onChange={this.handleSalutationChange} value={optionsSalutation.filter(({ value }) => value === salutation)} isLoading={isLoadingSelect2.salutation}></Select2>
											<span className="text-danger">{this.state.errors["salutation"]}</span>
										</div>
									</div>
									<div className="form-group row">
										<label className="col-sm-4 col-form-label" htmlFor="title-view">Title <p style={{ color: 'grey' }}><i>(optional)</i></p></label>
										<div className="col-sm-8">
											<Select2 reference="title" className="reactSelect2" id="title-view" options={optionsTitle} onChange={this.handleTitleChange} value={optionsTitle.filter(({ value }) => value === title)} isLoading={isLoadingSelect2.title}></Select2>
											<span className="text-danger">{this.state.errors["title"]}</span>
										</div>
									</div>
									<div className="form-group row">
										<label className="col-sm-4 col-form-label">Member Name</label>
										<div className="col-sm-8">
											<div className="row">
												<div className="col">
													<div className="row">
														<label className="col-sm-12 col-form-label" htmlFor="firstname-view">First Name </label>
														<div className="col-sm-12">
															<input className="form-control" type="text" id="firstname-view" ref="firstname" maxLength="45" value={firstname} onChange={this.handleFirstNameChange} />
															<span className="text-danger">{this.state.errors["firstname"]}</span>
														</div>
													</div>
												</div>
												{/* <div className="col">
													<div className="row">
														<label className="col-sm-12 col-form-label" htmlFor="middlename-view">Middle Name</label>
														<div className="col-sm-12">
															<input className="form-control" type="text" id="middlename-view" ref="middlename" maxLength="45" value={middlename} onChange={this.handleMiddleNameChange} />
															<span className="text-danger">{this.state.errors["middlename"]}</span>
														</div>
													</div>
												</div> */}
												<div className="col">
													<div className="row">
														<label className="col-sm-12 col-form-label" htmlFor="lastname-view">Last Name</label>
														<div className="col-sm-12">
															<input className="form-control" type="text" id="lastname-view" ref="lastname" maxLength="45" value={lastname} onChange={this.handleLastNameChange} />
															<span className="text-danger">{this.state.errors["lastname"]}</span>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
									{/* <div className="form-group row">
										<label className="col-sm-4 col-form-label" htmlFor="nameoncard-view">Name on Card </label>
										<div className="col-sm-8">
											<input className="form-control" type="text" id="nameoncard-view" ref="nameoncard" maxLength="32" defaultValue={nameoncard} onChange={this.handleNameOnCardChange} />
											<span className="text-danger">{this.state.errors["nameoncard"]}</span>
										</div>
									</div> */}
									<div className={(firstname !== '' || lastname !== '') ? "form-group row" : "form-group row hidden"}>
										<label className="col-sm-4 col-form-label" htmlFor="nameoncard-view">Name On Card </label>
										<div className="col-sm-8">
											<div className="row">
												{nameoncarddata}
												{/* <label className="col-sm-12 col-form-label form-inline" htmlFor="" key="">
													<input name="nameoncard" value={customnameoncard} id="customnameoncard" type="radio" onChange={this.handleNameOnCardChange} checked={nameoncard === customnameoncard} />
													&nbsp;
													<input className="form-control" type="text" id="customnameoncard-view" ref="customnameoncard" maxLength="45" value={customnameoncard} onChange={this.handleCustomNameOnCardChange} />
												</label> */}
											</div>
											<span className="text-danger">{this.state.errors["nameoncard"]}</span>
										</div>
									</div>
									<div className="form-group row">
										<label className="col-sm-4 col-form-label">Gender</label>
										<div className="col-sm-8">
											<div className="row mt-2">
												{genderlistdata}
											</div>
										</div>
									</div>
									<div className="form-group row">
										<label className="col-sm-4 col-form-label" htmlFor="birthdate-view">Date of Birth </label>
										<div className="col-sm-8">
											<Datepicker className="form-control" id="birthdate-view" onChange={this.handleBirthDateChange} selected={birthdate} dateFormat={"DD/MM/YYYY"} minDate={maxbirthdate} maxDate={minbirthdate} />
											<span className="text-danger">{this.state.errors["birthdate"]}</span>
										</div>
									</div>
								</div>
								<div className="col-md-6">
									<div className="form-group row">
										<label className="col-sm-4 col-form-label" htmlFor="nationality-view">Nationality </label>
										<div className="col-sm-8">
											<Select2 reference="nationality" className="reactSelect2" id="nationality-view" options={optionsNationality} onChange={this.handleNationalityChange} value={optionsNationality.filter(({ value }) => value === nationality)} isLoading={isLoadingSelect2.nationality}></Select2>
											<span className="text-danger">{this.state.errors["nationality"]}</span>
										</div>
									</div>
									<div className="form-group row">
										<label className="col-sm-4 col-form-label" htmlFor="religion-view">Religion <p style={{ color: 'grey' }}><i>(optional)</i></p></label>
										<div className="col-sm-8">
											<Select2 reference="religion" className="reactSelect2" id="religion-view" options={optionsReligion} onChange={this.handleReligionChange} value={optionsReligion.filter(({ value }) => value === religion)} isLoading={isLoadingSelect2.religion}></Select2>
											<span className="text-danger">{this.state.errors["religion"]}</span>
										</div>
									</div>
									<div className="form-group row">
										<label className="col-sm-4 col-form-label" htmlFor="language-view">Preferred Language </label>
										<div className="col-sm-8">
											<Select2 reference="language" className="reactSelect2" id="language-view" options={optionsLanguage} onChange={this.handleLanguageChange} value={optionsLanguage.filter(({ value }) => value === language)} isLoading={isLoadingSelect2.language}></Select2>
											<span className="text-danger">{this.state.errors["language"]}</span>
										</div>
									</div>
									<div className="form-group row">
										<label className="col-sm-4 col-form-label" htmlFor="passportno-view">Passport No. <p style={{ color: 'grey' }}><i>(optional)</i></p></label>
										<div className="col-sm-8">
											<input className="form-control" type="text" id="passportno-view" ref="passportno" maxLength="45" value={passportno} onChange={this.handlePassportNoChange} />
											<span className="text-danger">{this.state.errors["passportno"]}</span>
										</div>
									</div>
									<div className="form-group row">
										<label className="col-sm-4 col-form-label" htmlFor="idcardno-view">ID Card No. <p style={{ color: 'grey' }}><i>(optional)</i></p></label>
										<div className="col-sm-8">
											<input className="form-control" type="text" id="idcardno-view" ref="idcardno" maxLength="45" value={idcardno} onChange={this.handleIdCardNoChange} />
											<span className="text-danger">{this.state.errors["idcardno"]}</span>
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