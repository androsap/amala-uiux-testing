import React, { Component } from 'react';
import { SaveRequest, RetrieveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import ErrorGeneral from '../../error/ErrorGeneral';
import { connect } from "react-redux";
import { InputText, Button, Alert, DateRangeBase } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin } from 'antd';
import moment from 'moment';

const prefixmenuname = 'MBCOTOUR';
const menucode = 'MBCOTOUR';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			actionspage: 'create',
			responseMessage: '',
			formrender: true,
		}
	}

	componentDidMount() {
		this.checkPermission();
	}

	checkPermission() {
		let id = this.props.tourcodeid;
		const { permission } = this.props;
		const { usermenu } = permission;
		if (id) {
			let titlepage = 'Edit';
			let actionspage = 'update';
			let specialfielddisabled = true;
			let generalfielddisabled = false;
			//role can't update action
			if (!usermenu[menucode][prefixmenuname + "_UPDATE"]) {
				titlepage = 'View';
				actionspage = 'view';
				generalfielddisabled = true;
			}
			//change into update page
			let fielddisabled = { specialfielddisabled, generalfielddisabled };
			this.setState({ titlepage, actionspage, fielddisabled });
			this.props.setTitlePage(titlepage);
			this.getDetail(id);
		}
	}

	getDetail = (tourcodeid) => {
		let url = api.url.tourcode.list;
		let criteria = { tourcodeid };
		//call loader
		this.setState({ isLoading: true });
		RetrieveRequest(url, criteria).then((response) => {
			const { status, result } = response;
			if (status.responsecode.substring(0, 1) === '0') {
				if (result.length !== 0) {
					let tourcode = (result[0].tourcode) ? result[0].tourcode : undefined;
					let startdate = (result[0].startdate) ? moment(result[0].startdate).format('DD/MM/YYYY') : null;
					let enddate = (result[0].enddate) ? moment(result[0].enddate).format('DD/MM/YYYY') : null;

					this.props.form.setFieldsValue({ tourcode });
					this.setState({ startdate, enddate });
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
		this.props.form.validateFieldsAndScroll((err, input) => {
			if (!err) {
				this.setState({ isLoading: true });
				//define parameter
				let memberid = this.props.match.params.ID;
				let tourcode = input.tourcode.toUpperCase();
				let corporatecode = this.props.profile.corporatecode;
				let startdate = (input.date && input.date[0]) ? moment(input.date[0]).format("YYYY-MM-DD") : null;
				let enddate = (input.date && input.date[1]) ? moment(input.date[1]).format("YYYY-MM-DD") : null;

				let url = api.url.tourcode.create;
				let data = { tourcode, corporatecode, startdate, enddate };
				let message = 'New data has been created';

				SaveRequest(url, data).then((response) => {
					const { responsecode, responsemessage } = response.status;
					if (responsecode.substring(0, 1) === '0') {
						message = (responsemessage) ? responsemessage : message;
						Alert.success(message);
						this.props.refreshHeader();
						this.props.history.push('/member-corporate/form/' + memberid + '/tour-code');
					} else {
						Alert.error(responsemessage);
					}
					//hide loader
					this.setState({ isLoading: false });
				})
			}
		});
	};

	render() {
		const formItemLayout = {
			labelCol: { xs: { span: 24 }, sm: { span: 6 }, },
			wrapperCol: { xs: { span: 24 }, sm: { span: 18 } }
		};
		const { formrender, actionspage } = this.state;

		if (formrender) {
			//title bar on browser
			document.title = "Create Tour Code | Loyalty Management System";
			//render form
			return (
				<Row>
					<Spin spinning={this.state.isLoading}>
						<Form {...formItemLayout} onSubmit={this.saveAction}>
							<Row gutter={24}>
								<Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 14, offset: 4 }} xl={{ span: 14, offset: 4 }}>
									<InputText form={this.props.form} labeltext="Tour Code" datafield="tourcode" validationrules={['required']} maxLength={45} />
									<DateRangeBase form={this.props.form} labeltext="Date" datafield="date" placeholder={['Start Date', 'End Date']} validationrules={['required']} minDate={moment(new Date()).add(1, 'day')} />
								</Col>
							</Row>
							<Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
								{
									(actionspage !== 'view') ? <Button htmlType="submit" type="default" label="Save" /> : null
								}
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