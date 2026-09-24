import React, { Component } from 'react';
import { DetailRequest, SaveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import ErrorGeneral from '../../error/ErrorGeneral';
import { connect } from "react-redux";
import { InputText, Button, Alert, CustomTransactionSelect, SelectBase, DatePickerBase, InputNumber } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin, Icon, Modal } from 'antd';
import { getProfile } from '../../../utilities/AuthService';
import moment from 'moment';

const { Title } = Typography;
const optionsTrxType = [
	{ value: 'EARNING', label: 'Earning' },
	{ value: 'SPENDING', label: 'Spending' }
];

const isBOD = getProfile().rolename === 'BOD';
class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			titlepage: 'Create',
			actionspage: 'create',
			responseCode: '0',
			responseMessage: '',
			formrender: true,
			fieldvalue: {},
			cancelcustomtrx: false,
			visibleCancelModal: false,
			totalprice: 0,
			fielddisabled: {
				specialfielddisabled: false,
				generalfielddisabled: false,
			}
		}
	}

	componentDidMount = () => {
		if (isBOD) this.onChangeTrxType('EARNING');
        this.props.form.setFieldsValue({ awardmiles: '0' });
        this.props.form.setFieldsValue({ tiermiles: '0' });
        this.props.form.setFieldsValue({ frequency: '0' });
		this.props.form.setFieldsValue({ tierrenewal: '0' });
        this.props.form.setFieldsValue({ frequencyrenewal: '0' });
	}

	saveAction = (e) => {
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((err, input) => {
			if (!err) {
				this.setState({ isLoading: true });
				//define parameter
				let trxdate = (input.trxdate) ? moment(input.trxdate).format("YYYY-MM-DD") : null;
				let trxtype = input.trxtype;
				let memberid = this.props.match.params.ID;
				let awardmiles = input.awardmiles;
				let tiermiles = input.tiermiles;
				let frequency = input.frequency;
				let tierrenewal = input.tierrenewal;
				let frequencyrenewal = input.frequencyrenewal;
				let customtrxcode = input.customtrxcode;
				let certificateid = null;
				let notes = (input.certificateid) ? input.certificateid : null;

				let url = '';
				let data = {};
				if (trxtype === 'SPENDING') {
					let isfee = false;
					let feeforupdate = false;

					if (customtrxcode === "CORRCHANGESCHEDULE") {
						feeforupdate = true;
					} else if (customtrxcode === "CORRECTIONREDEPSTFEE") {
						isfee = true;
					}

					url = api.url.transaction.spending;
					awardmiles = "-" + awardmiles;
					tiermiles = "-" + tiermiles;
					frequency = "-" + frequency;
					tierrenewal = "-" + tierrenewal;
					frequencyrenewal = "-" + frequencyrenewal;
					data = { trxdate, certificateid, customtrxcode, memberid, awardmiles, tiermiles, frequency, tierrenewal, frequencyrenewal, isfee, feeforupdate,notes };
				} else {
					let activityid = null;

					url = api.url.transaction.earning;
					data = { activityid, trxdate, memberid, customtrxcode, awardmiles, tiermiles, frequency, tierrenewal, frequencyrenewal, notes };
				}

				let message = 'New data has been created';
				SaveRequest(url, data).then((response) => {
					const { responsecode, responsemessage } = response.status;
					if (responsecode.substring(0, 1) === '0') {
						message = (responsemessage) ? responsemessage : message;
						Alert.success(message);
						this.props.refreshHeader();
						this.props.history.push('/member/form/' + memberid + '/transaction');
					} else {
						Alert.error(responsemessage);
					}
					//hide loader
					this.setState({ isLoading: false });
				})
			}
		});
	};

	onChangeTrxType = (value) => {
		let customtrxcode = undefined;
		if (value === 'EARNING') this.componentCustomTransactionSelect.retrieveData({ validforearn: true })
		if (value === 'SPENDING') this.componentCustomTransactionSelect.retrieveData({ validforredeem: true })
		this.setState({ fielddisabled: { ...this.state.fielddisabled }, cancelcustomtrx: false });
		this.props.form.setFieldsValue({ customtrxcode });
	};

	onChangeCustomTrx = (value) => {
		if (value === "CORRCHANGESCHEDULE" || value === "CORRECTIONREDEPSTFEE") {
			this.setState({ cancelcustomtrx: true });
		} else this.setState({ cancelcustomtrx: false });
	};

	handleModalCalculator = (value) => {
		this.setState({ visibleCancelModal: value });
	};

	handleApplyCalculator = () => {
		let awardmilesmodal = this.props.form.getFieldValue('awardmilesmodal') ? Number(this.props.form.getFieldValue('awardmilesmodal')) : 0;
		this.props.form.setFieldsValue({ awardmiles: awardmilesmodal });
		this.handleModalCalculator(false);
	};

	render() {
		const formItemLayout = {
			labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
			wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
		};
		const { titlepage, actionspage, formrender, cancelcustomtrx, visibleCancelModal, totalprice } = this.state;
		const { specialfielddisabled, generalfielddisabled } = this.state.fielddisabled;
		const { menucode, prefixmenuname, memberlock } = this.props;

		const { blockaccrual, blockredeem } = memberlock || {};
		const optTrxType = [...optionsTrxType];

		const customtrxdisabled = this.props.form.getFieldValue('trxtype') ? false : true;
		const awardmilesdisabled = this.props.form.getFieldValue('certificateid') ? false : true;
		const certificateid = this.props.form.getFieldValue('certificateid');

		let percentage = this.props.form.getFieldValue('percentage') ? Number(this.props.form.getFieldValue('percentage')) : 0;
		let price = this.props.form.getFieldValue('price') ? Number(this.props.form.getFieldValue('price')) : 0;
		let awardmilesmodal = (percentage && price) ? `${Math.ceil((percentage / 100) * price)}` : undefined;

		if (blockaccrual && !blockredeem) optTrxType.shift();
		else if (!blockaccrual && blockredeem) optTrxType.pop();
		else if (blockaccrual && blockredeem) optTrxType.splice(0, 2);

		if (formrender) {
			//title bar on browser
			document.title = titlepage + " Transaction | Loyalty Management System";
			//render form
			return (
				<Row>
					<Modal title='Calculator' visible={visibleCancelModal} onCancel={() => this.handleModalCalculator(false, certificateid)} destroyOnClose={true} footer={null} width={600}>
						<Form {...formItemLayout} onSubmit={this.saveAction}>
							<Row gutter={24}>
								<Col className="gutter-row" xs={24}>
									<InputText wrapperCol={{ span: 8, push: 1 }} labelCol={{ span: 8, push: 1 }} form={this.props.form} labeltext="Price" datafield="price" maxLength="10" />
									<InputText wrapperCol={{ span: 8, push: 1 }} labelCol={{ span: 8, push: 1 }} form={this.props.form} labeltext="Percentage" datafield="percentage" suffix="%" />
									<InputText wrapperCol={{ span: 8, push: 1 }} labelCol={{ span: 8, push: 1 }} form={this.props.form} labeltext="Award Miles" datafield="awardmilesmodal" defaultValue={awardmilesmodal} disabled={true} />
								</Col>
							</Row>
							<Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
								<Button htmlType="button" type="primary" label="Apply" onClick={this.handleApplyCalculator}></Button>
								<Button htmlType="button" type="default" label="Back" onClick={() => this.handleModalCalculator(false)} />
							</Row>
						</Form>
					</Modal>


					<Row>
						<Col xs={24} xl={22}>
							<Title level={4}>{titlepage} Transaction</Title>
						</Col>
						<Divider />
					</Row>
					<Spin spinning={this.state.isLoading}>
						<Form {...formItemLayout} onSubmit={this.saveAction}>
							<Row gutter={24}>
								<Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
									<SelectBase form={this.props.form} labeltext="Transaction Type" datafield="trxtype" validationrules={['required']} options={optTrxType} defaultValue={(isBOD) ? "EARNING" : undefined} onChange={this.onChangeTrxType} disabled={(isBOD) ? true : generalfielddisabled} />
									<CustomTransactionSelect ref={(e) => { this.componentCustomTransactionSelect = e }} onChange={this.onChangeCustomTrx} form={this.props.form} labeltext="Custom Transaction" datafield="customtrxcode" validationrules={['required']} disabled={customtrxdisabled} customtrx={true} />
									{(cancelcustomtrx) ? <InputText form={this.props.form} labeltext="Certificate ID" datafield="certificateid" validationrules={['required', 'max.20']} maxLength="20" /> : null}
									{
										(cancelcustomtrx) ? <Row gutter={24}>
											<Col xs={24} sm={{ span: 16 }} style={{ lineHeight: '40px' }}>
												<InputText labelCol={{ span: 8, offset: 4 }} wrapperCol={{ span: 12 }} style={{ marginLeft: 4 }} form={this.props.form} labeltext="Award Miles" datafield="awardmiles" validationrules={['required', 'pattern.number']} maxLength="20" disabled={awardmilesdisabled} />
											</Col>
											<Col xs={24} sm={{ span: 4 }} style={{ lineHeight: '40px' }}  >
												<Button htmlType="button" type="default" icon="calculator" label="calculator" onClick={() => this.handleModalCalculator(true)} style={{ borderRadius: 20 }}></Button>
											</Col>
										</Row> : <InputText form={this.props.form} labeltext="Award Miles" datafield="awardmiles" validationrules={['required', 'pattern.number', 'max.20']} maxLength="20" disabled={specialfielddisabled} />
									}
									<InputText form={this.props.form} labeltext="Tier Miles" datafield="tiermiles" validationrules={['required', 'pattern.number', 'max.20',]} maxLength="20" disabled={specialfielddisabled} />
									<InputText form={this.props.form} labeltext="Frequency" datafield="frequency" validationrules={['required', 'pattern.number', 'max.20',]} maxLength="20" disabled={(isBOD) ? true : specialfielddisabled} />
									<InputText form={this.props.form} labeltext="Tier Renewal" datafield="tierrenewal" validationrules={['required', 'pattern.number', 'max.20',]} maxLength="20" disabled={specialfielddisabled} />
									<InputText form={this.props.form} labeltext="Frequency Renewal" datafield="frequencyrenewal" validationrules={['required', 'pattern.number', 'max.20',]} maxLength="20" disabled={specialfielddisabled} />
									<DatePickerBase form={this.props.form} labeltext="Transaction Date" datafield="trxdate" validationrules={['required']} maxDate={moment()} disabled={generalfielddisabled} />
								</Col>
							</Row>
							<Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
								{
									(actionspage === 'create') ?
										<Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE"></Button>
										: (actionspage === 'update') ?
											<Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE"></Button>
											: null
								} &nbsp;
								<Button url={'/member/form/' + this.props.match.params.ID + '/transaction'} htmlType="link" type="default" label="Back" />
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
