import React, { Component } from 'react';
import { RetrieveRequest, SaveRequest, DetailRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import ErrorGeneral from '../../error/ErrorGeneral';
import { connect } from "react-redux";
import { InputText, PartnerSelect, ActivityCodeSelect, CobrandSelect, Button, Alert, DatePickerBase, DateRangeBase } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin } from 'antd';
import moment from 'moment';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			titlepage: 'Enroll',
			actionspage: 'create',
			responseCode: '0',
			responseMessage: '',
			formrender: true,
			fieldvalue: {
				status: null
			},
			fielddisabled: {
				specialfielddisabled: false,
				generalfielddisabled: false,
				cobrandfielddisabled: true,
				activityfielddisabled: true
			}
		}
	}

	checkPermission() {
		let id = this.props.membercobrandid;
		const { menucode, permission, prefixmenuname, formType } = this.props;
		const { usermenu } = permission;
		if (id && formType !== 'create') {
			let titlepage = 'Edit';
			let actionspage = 'update';
			let specialfielddisabled = true;
			let generalfielddisabled = false;
			let cobrandfielddisabled = true;

			if (!usermenu[menucode][prefixmenuname + "_UPDATE"]) {
				titlepage = 'View';
				actionspage = 'view';
				generalfielddisabled = true;
			}
			//change into update page
			let fielddisabled = { specialfielddisabled, generalfielddisabled, cobrandfielddisabled };
			this.setState({ titlepage, actionspage, fielddisabled });
			this.getDetail(id, actionspage);
		} else {
			if (!usermenu[menucode][prefixmenuname + "_CREATE"]) {
				this.setState({ formrender: false });
			} else {
				this.componentPartnerSelect.retrieveData({ partnertype: "NONAIR" });
			}
		}
	}

	componentDidMount() {
		this.checkPermission();
	}

	getDetail = (membercobrandid, actionspage) => {
		let url = api.url.membercobrand.list;
		let criteria = { membercobrandid };
		//call loader
		this.setState({ isLoading: true });
		RetrieveRequest(url, criteria).then((response) => {
			const { status, result } = response;
			if (status.responsecode.substring(0, 1) === '0') {
				if (result.length !== 0) {
					let partnercode = (result[0].partnercode) ? result[0].partnercode : undefined;
					let partnername = (result[0].partnername) ? result[0].partnername : undefined;
					let cobrandcode = (result[0].cobrandcode) ? result[0].cobrandcode : undefined;
					let cobrandname = (result[0].cobrandname) ? result[0].cobrandname : undefined;
					let activitycode = (result[0].activitycode) ? result[0].activitycode : undefined;
					let applicationid = (result[0].applicationid) ? result[0].applicationid.toString() : undefined;
					let applicationdate = (result[0].applicationdate) ? moment(result[0].applicationdate) : undefined;
					let status = (result[0].status) ? result[0].status : undefined;
					let startdate = (result[0].startdate) ? moment(result[0].startdate) : undefined;
					let enddate = (result[0].enddate) ? moment(result[0].enddate) : undefined;
					let date = [startdate, enddate];
					let activityfielddisabled = (actionspage !== "view") ? false : true;

					this.setState({
						fieldvalue: { ...this.state.fieldvalue, status },
						fielddisabled: { ...this.state.fielddisabled, activityfielddisabled }
					});

					let setValue = { partnercode, cobrandcode, activitycode, applicationid, applicationdate, date };
					this.props.form.setFieldsValue(setValue);

					this.componentPartnerSelect.retrieveData({}, { partnercode, partnername }, actionspage);
					this.componentCobrandSelect.retrieveData({ partnercode }, { cobrandcode, cobrandname }, actionspage);
					this.componentActivitySelect.retrieveData({ partnercode })
				} else {
					this.setState({ responseMessage: 'Data not found', formrender: false });
				}
			} else {
				this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
			}
			this.setState({ isLoading: false });
		});
	}

	saveAction = (e) => {
		e.preventDefault();
		const { actionspage } = this.state;
		this.props.form.validateFieldsAndScroll((err, input) => {
			if (!err) {
				this.setState({ isLoading: true });
				//define parameter
				let memberid = this.props.memberid;
				let cobrandcode = (input.cobrandcode) ? input.cobrandcode : null;
				let applicationid = (input.applicationid) ? input.applicationid : null;
				let activitycode = (input.activitycode) ? input.activitycode : null;
				let applicationdate = (input.applicationdate) ? moment(input.applicationdate).format("YYYY-MM-DD") : null;
				let pointconversion = (input.pointconversion) ? input.pointconversion : null;
				let mileageconversion = (input.mileageconversion) ? input.mileageconversion : null;
				let enrolldate = moment().format("YYYY-MM-DD");
				let status = this.state.fieldvalue.status;

				let url = '';
				let data = {
					memberid, cobrandcode, applicationid, applicationdate, activitycode, enrolldate, status,
					pointconversion, mileageconversion
				};
				let message = '';
				if (actionspage === 'create') {
					message = 'New data has been created';
					url = api.url.membercobrand.create;
				} else {
					url = api.url.membercobrand.update;
					message = 'Data has been updated';
					data.membercobrandid = this.props.membercobrandid;
					data.startdate = (input.date && input.date[0]) ? moment(input.date[0]).format("YYYY-MM-DD") : null;;
					data.enddate = (input.date && input.date[1]) ? moment(input.date[1]).format("YYYY-MM-DD") : null;;
				}

				SaveRequest(url, data).then((response) => {
					const { responsecode, responsemessage } = response.status;
					if (responsecode.substring(0, 1) === '0') {
						message = (responsemessage) ? responsemessage : message;
						Alert.success(message);
						this.props.refreshHeader();
						this.props.onClose();
					} else {
						Alert.error(responsemessage);
					}
					//hide loader
					this.setState({ isLoading: false });
				})
			}
		});
	};

	getRating = (partnercode, activitycode, pointconversion) => {
		if (partnercode && activitycode && pointconversion) {
			let tierid = this.props.tierid;
			let activityvolume = (pointconversion) ? Number.parseInt(pointconversion, 0) : 0;
			let activitydate = moment(new Date()).format("YYYY-MM-DD");
			let activitytype = 'NON_AIR';
			let url = api.url.transaction.rating;
			let mileageconversion = null;
			let data = { activitydate, activityvolume, partnercode, activitycode, tierid, activitytype };
			this.setState({ isLoading: true });
			DetailRequest(url, data).then((response) => {
				const { status, result } = response;
				if (status.responsecode.substring(0, 1) === '0' && result !== undefined) {
					mileageconversion = result.awardmiles;
				} else {
					Alert.error(status.responsemessage);
				}
				this.props.form.setFieldsValue({ mileageconversion });
				this.setState({ isLoading: false });
			});
		}
	}

	handlePartnerChange = (partnercode) => {
		let cobrandfielddisabled = (partnercode) ? false : true;
		let activityfielddisabled = (partnercode) ? false : true;
		let cobrandcode = undefined;
		let activitycode = undefined;
		if (partnercode) {
			this.componentActivitySelect.retrieveData({ partnercode });
			this.componentCobrandSelect.retrieveData({ partnercode });
		}

		this.props.form.setFieldsValue({ cobrandcode, activitycode });
		this.setState({ fielddisabled: { ...this.state.fielddisabled, cobrandfielddisabled, activityfielddisabled } });
	}

	handleActivityChange = (activitycode) => {
		/* RATING GET MILAGE CONVERSION */
		let partnercode = this.props.form.getFieldValue('partnercode');
		let pointconversion = this.props.form.getFieldValue('pointconversion');
		this.getRating(partnercode, activitycode, pointconversion);
	}

	handlePointConversionChange = (event) => {
		let pointconversion = event === null ? null : event.target.value;
		/* RATING GET MILAGE CONVERSION */
		let partnercode = this.props.form.getFieldValue('partnercode');
		let activitycode = this.props.form.getFieldValue('activitycode');
		this.getRating(partnercode, activitycode, pointconversion);
	}

	render() {
		const formItemLayout = {
			labelCol: { xs: { span: 24 }, sm: { span: 10 }, },
			wrapperCol: { xs: { span: 24 }, sm: { span: 14 } }
		};
		const { titlepage, actionspage, formrender } = this.state;
		const { specialfielddisabled, generalfielddisabled, cobrandfielddisabled, activityfielddisabled } = this.state.fielddisabled;
		const { menucode, prefixmenuname } = this.props;
		
		if (formrender) {
			//title bar on browser
			document.title = titlepage + " Cobrand | Loyalty Management System";
			//render form
			return (
				<Row>
					<Spin spinning={this.state.isLoading}>
						<Form {...formItemLayout} onSubmit={this.saveAction}>
							<Row gutter={24}>
								<Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 16, offset: 2 }} xl={{ span: 16, offset: 2 }}>
									<PartnerSelect ref={(e) => { this.componentPartnerSelect = e }} form={this.props.form} labeltext="Partner" datafield="partnercode" validationrules={['required']} onChange={this.handlePartnerChange} disabled={specialfielddisabled} />
									<CobrandSelect ref={(e) => { this.componentCobrandSelect = e }} form={this.props.form} labeltext="Cobrand" datafield="cobrandcode" validationrules={['required']} disabled={cobrandfielddisabled} />
									<ActivityCodeSelect ref={(e) => { this.componentActivitySelect = e }} form={this.props.form} labeltext="Activity" datafield="activitycode" validationrules={[]} onChange={this.handleActivityChange} disabled={activityfielddisabled} />
									<InputText form={this.props.form} labeltext="Point Conversion" datafield="pointconversion" validationrules={['pattern.number', 'max.11']} maxLength={11} onBlur={this.handlePointConversionChange} disabled={generalfielddisabled} />
									<InputText form={this.props.form} labeltext="Mileage Conversion" datafield="mileageconversion" validationrules={['pattern.number']} maxLength={11} disabled={true} />
									<InputText form={this.props.form} labeltext="Application ID" datafield="applicationid" validationrules={['pattern.number', 'max.11']} maxLength={11} disabled={generalfielddisabled} />
									<DatePickerBase form={this.props.form} labeltext="Application Date" datafield="applicationdate" validationrules={[]} disabled={generalfielddisabled} />
									{
										(actionspage !== 'create') ?
											<DateRangeBase form={this.props.form} labeltext="Date" datafield="date" disabled={generalfielddisabled} />
											: null
									}
								</Col>
							</Row>
							<Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
								{
									(actionspage === 'create') ?
										<Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
										: (actionspage === 'update') ?
											<Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
											: null
								} &nbsp;
                            </Row>
						</Form>
					</Spin>
				</Row>
			)
		} else {
			return (<ErrorGeneral {...this.props} message={this.state.responseMessage} />);
		}
	}
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));