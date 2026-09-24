import React, { Component } from 'react';
import { RetrieveRequest, SaveRequest, DeleteRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import ErrorGeneral from '../error/ErrorGeneral';
import { connect } from "react-redux";
import { InputText, SelectBase, MembershipSelect, AirlineSelect, SubclassSelect, Button, Alert } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin, Modal, Table, Button as AntButton } from 'antd';
import moment from 'moment';

import BcruleForm from './BcruleForm';

const optionsRouteType = [
	{ label: 'Domestic', value: 'DOMESTIC' },
	{ label: 'International', value: 'INTERNATIONAL' }
]

const { Column } = Table;
const { Title, Text } = Typography;

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
			fieldvalue: {
				bcrule: [],
				bcruleheaderid: null,
				ruletype: null,
				airlinecode: null,
				ruledetail: {},
				bcruledetailid: null,
				actionsdetailpage: 'create'
			},
			showAddModal: false,
			fielddisabled: {
				specialfielddisabled: false,
				generalfielddisabled: false,
				subclasscodedisabled: true
			}
		}
	}

	checkPermission() {
		let id = this.props.match.params.ID;
		const { menucode, permission, prefixmenuname } = this.props;
		const { usermenu } = permission;
		if (id) {
			let titlepage = 'Edit';
			let actionspage = 'update';
			let specialfielddisabled = true;
			let generalfielddisabled = false;

			if (!usermenu[menucode][prefixmenuname + "_UPDATE"]) {
				titlepage = 'View';
				actionspage = 'view';
				generalfielddisabled = true;
			}
			//change into update page
			let fielddisabled = { ...this.state.fielddisabled, specialfielddisabled, generalfielddisabled };
			this.setState({ titlepage, actionspage, fielddisabled });
			this.getDetail(id, actionspage);
		} else {
			if (!usermenu[menucode][prefixmenuname + "_CREATE"]) {
				this.setState({ formrender: false });
			} else {
				this.componentMembershipSelect.retrieveData();
				this.componentAirlineSelect.retrieveData();
			}
		}
	}

	componentDidMount() {
		this.checkPermission();
	}

	getDetail = (bcruleheaderid, actionspage) => {
		let url = api.url.accrualrulebc.list;
		let criteria = { bcruleheaderid };
		//call loader
		this.setState({ isLoading: true });
		RetrieveRequest(url, criteria).then((response) => {
			let { status, result } = response;
			if (status.responsecode.substring(0, 1) === '0') {
				if (result.length !== 0) {
					result = result[0];
					let bcruleheaderid = (result.bcruleheaderid) ? result.bcruleheaderid : null;
					let bcrulename = (result.bcrulename) ? result.bcrulename : undefined;
					let routetype = (result.routetype) ? result.routetype : undefined;
					let membershipid = (result.membershipid) ? result.membershipid : undefined;
					let airlinecode = (result.airlinecode) ? result.airlinecode : undefined;
					let airlinename = (result.airlinename) ? result.airlinename : undefined;
					let subclasscode = (result.subclasscode) ? result.subclasscode : undefined;
					let subclassname = (result.subclassname) ? result.subclassname : undefined;
					let bcrule = (result.bcrule) ? result.bcrule.map((obj, key) => {
						return {
							...obj,
							key: key + 1,
							codeshare: {
								...obj.codeshare,
								originairportiatacode: (obj.codeshare && obj.codeshare.originairport) ? obj.codeshare.originairport.airportiatacode : null,
								destinationairportiatacode: (obj.codeshare && obj.codeshare.destinationairport) ? obj.codeshare.destinationairport.airportiatacode : null
							}
						}
					}) : [];

					let setValue = { bcrulename, routetype, membershipid, airlinecode, subclasscode };
					this.props.form.setFieldsValue(setValue);

					this.componentMembershipSelect.retrieveData();
					this.componentAirlineSelect.retrieveData({}, { airlinecode, airlinename }, actionspage);
					this.componentSubclassSelect.retrieveData({ airlinecode }, { subclasscode, subclassname }, actionspage);

					let subclasscodedisabled = (actionspage !== 'view') ? false : true;
					this.setState({
						fielddisabled: { ...this.state.fielddisabled, subclasscodedisabled },
						fieldvalue: { ...this.state.fieldvalue, bcrule, airlinecode, bcruleheaderid }
					});
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
				let bcrulename = input.bcrulename;
				let routetype = input.routetype;
				let airlinecode = input.airlinecode;
				let membershipid = input.membershipid;
				let subclasscode = input.subclasscode;
				let compartmentcode = this.componentSubclassSelect.getCompartment(airlinecode, subclasscode);
				let bcrule = this.state.fieldvalue.bcrule;

				let data = { bcrulename, routetype, airlinecode, membershipid, compartmentcode, subclasscode, bcrule };

				let message = '';
				let url = '';
				if (actionspage === 'create') {
					message = 'New data has been created';
					url = api.url.accrualrulebc.create;
				} else {
					message = 'Data has been updated';
					url = api.url.accrualrulebc.update;
					data.bcruleheaderid = this.props.match.params.ID;
				}

				SaveRequest(url, data).then((response) => {
					const { responsecode, responsemessage } = response.status;
					if (responsecode.substring(0, 1) === '0') {
						message = (responsemessage) ? responsemessage : message;
						Alert.success(message);
						this.props.history.push('/accrual-rule-bc');
					} else {
						Alert.error(responsemessage);
					}
					//hide loader
					this.setState({ isLoading: false });
				})
			}
		});
	};

	onChangeAirline = (airlinecode) => {
		let subclasscode = undefined;
		let subclasscodedisabled = (airlinecode) ? false : true;
		this.componentSubclassSelect.retrieveData({ airlinecode });
		this.setState({
			fieldvalue: { ...this.state.fieldvalue, airlinecode },
			fielddisabled: { ...this.state.fielddisabled, subclasscodedisabled }
		});
		this.props.form.setFieldsValue({ subclasscode });
	}

	handleCancel = () => {
		this.setState({
			showAddModal: false,
			fieldvalue: {
				...this.state.fieldvalue,
				ruletype: null,
				ruledetail: {},
				bcruledetailid: null,
				actionsdetailpage: 'create'
			}
		});
	};

	handleOpenModal = (ruletype) => {
		this.setState({
			showAddModal: true,
			fieldvalue: { ...this.state.fieldvalue, ruletype }
		});
	}

	saveBCRule = (input) => {
		const { actionsdetailpage } = this.state.fieldvalue;
		let { bcrule, ruletype } = this.state.fieldvalue;
		if (actionsdetailpage === 'create') {
			let lastkey = bcrule.length;
			input.key = lastkey + 1;
			input.bcruledetailid = null;
			input.ruletype = ruletype;
			// input.codeshare = {};
			// input.codeshare.codeshareid = (ruletype === 'CODESHARE') ? input.codeshareid : null;
			bcrule.push(input);
		} else if (actionsdetailpage === 'update') {
			for (const field in bcrule) {
				if (bcrule[field]['key'] === input.key) {
					bcrule[field] = input;
				}
			}
		}

		this.setState({ fieldvalue: { ...this.state.fieldvalue, bcrule } });
	}

	removeDetail = (e, key) => {
		e.preventDefault();
		const { actionspage } = this.state;
		let { bcrule } = this.state.fieldvalue;

		if (actionspage === 'update') {
			let bcruledetailid = bcrule.filter(obj => obj.key === key)[0];
			bcruledetailid = (bcruledetailid && bcruledetailid['bcruledetailid']) ? bcruledetailid['bcruledetailid'] : null;
			let url = api.url.accrualrulebc.deletedetail;
			let data = { bcruledetailid };
			var callback = (response) => {
				const { responsecode, responsemessage } = response.status;
				if (responsecode.substring(0, 1) === '0') {
					let message = (responsemessage) ? responsemessage : 'Selected data has been deleted';
					Alert.success(message);
				} else {
					Alert.error(responsemessage);
				}
				this.checkPermission();
			};

			DeleteRequest(url, data, callback);
		} else {
			bcrule = bcrule.filter(obj => obj.key !== key);
			this.setState({ fieldvalue: { ...this.state.fieldvalue, bcrule } });
		}
	}

	editDetail = (e, ruletype, key, bcruledetailid) => {
		e.preventDefault();
		let ruledetail = this.state.fieldvalue.bcrule.filter(obj => obj.key === key)[0];
		this.setState({
			showAddModal: true,
			fieldvalue: { ...this.state.fieldvalue, ruletype, ruledetail, bcruledetailid, actionsdetailpage: 'update' }
		});
	}

	render() {
		const formItemLayout = {
			labelCol: { xs: { span: 24 }, sm: { span: 10 }, },
			wrapperCol: { xs: { span: 24 }, sm: { span: 14 } }
		};
		const { titlepage, actionspage, formrender, showAddModal } = this.state;
		const { generalfielddisabled, subclasscodedisabled } = this.state.fielddisabled;
		const { menucode, prefixmenuname, permission } = this.props;
		const { bcrule, ruletype, airlinecode, ruledetail, bcruleheaderid, bcruledetailid, actionsdetailpage } = this.state.fieldvalue;

		let dataListPrimeFlight = bcrule.filter(obj => (obj.ruletype === 'PRIMEFLIGHT' && obj.active)).sort((a, b) => moment(b.effectivedate) - moment(a.effectivedate));
		let dataListCodeshareFlight = bcrule.filter(obj => (obj.ruletype === 'CODESHARE' && obj.codeshare.active)).sort((a, b) => moment(b.effectivedate) - moment(a.effectivedate));
		let codeshareidfielddisalbled = (airlinecode) ? false : true;
		let airlinecodefielddiabled = dataListCodeshareFlight.length > 0 ? true : false;

		if (formrender) {
			//title bar on browser
			document.title = titlepage + " Accrual Booking Class | Loyalty Management System";
			//render form
			return (
				<Row>
					<Row>
						<Col xs={24} xl={22}>
							<Title level={3}>{titlepage} Accrual Booking Class</Title>
						</Col>
						<Divider />
					</Row>
					<Modal visible={showAddModal} title="Create Rule" onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={700}>
						<BcruleForm permission={permission} menucode={menucode} prefixmenuname={prefixmenuname} actionspage={actionspage} actionsdetailpage={actionsdetailpage} airlinecode={airlinecode} ruletype={ruletype} ruledetail={ruledetail} bcruleheaderid={bcruleheaderid} bcruledetailid={bcruledetailid} refresh={this.getDetail} handleClose={this.handleCancel} saveBCRule={this.saveBCRule} />
					</Modal>
					<Spin spinning={this.state.isLoading}>
						<Form {...formItemLayout} onSubmit={this.saveAction}>
							<Row gutter={24}>
								<Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
									<InputText form={this.props.form} labeltext="Name" datafield="bcrulename" validationrules={['required']} disabled={generalfielddisabled} />
									<SelectBase form={this.props.form} labeltext="Route Type" datafield="routetype" validationrules={['required']} options={optionsRouteType} disabled={generalfielddisabled} />
									<MembershipSelect ref={(e) => { this.componentMembershipSelect = e }} form={this.props.form} labeltext="Membership" datafield="membershipid" validationrules={['required']} disabled={generalfielddisabled} />
									<AirlineSelect ref={(e) => { this.componentAirlineSelect = e }} form={this.props.form} labeltext="Airline" datafield="airlinecode" validationrules={['required']} onChange={this.onChangeAirline} disabled={airlinecodefielddiabled} />
									<SubclassSelect ref={(e) => { this.componentSubclassSelect = e }} form={this.props.form} labeltext="Subclass" datafield="subclasscode" validationrules={['required']} disabled={subclasscodedisabled} />
									<Form.Item label="Setup Rule for Prime Flight">
										<Button type="primary" size="default" label="Setup Rule" htmlType="button" onClick={() => this.handleOpenModal('PRIMEFLIGHT')} />
									</Form.Item>
								</Col>
								<Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 20, offset: 2 }} xl={{ span: 20, offset: 2 }}>
									<Table dataSource={dataListPrimeFlight} pagination={false} scroll={{ y: 240 }}>
										<Column title="Award Miles" dataIndex="awardmilesfactor" key="awardmilesfactor" render={(value, row) => Math.round(value * 100) + "%"} width="10%" />
										<Column title="Tier Miles" dataIndex="tiermilesfactor" key="tiermilesfactor" render={(value, row) => Math.round(value * 100) + "%"} width="10%" />
										<Column title="Frequency" dataIndex="frequency" key="frequency" width="10%" />
										<Column title="Minimum Award Miles" dataIndex="minawardmiles" key="minawardmiles" width="10%" />
										<Column title="Minimum Tier Miles" dataIndex="mintiermiles" key="mintiermiles" width="10%" />
										<Column title="Use Branded Fare" dataIndex="usebrandedfare" key="usebrandedfare" render={(value, row) => ((value) ? 'Yes' : 'No')} width="10%" />
										<Column title="Effective Date" dataIndex="effectivedate" key="effectivedate" render={(value) => ((value) ? moment(value).format('DD/MM/YYYY') : '')} width="10%" />
										<Column title="Discontinue Date" dataIndex="discontinuedate" key="discontinuedate" render={(value) => ((value) ? moment(value).format('DD/MM/YYYY') : '')} width="10%" />
										<Column
											title="Action"
											key="action"
											render={(value, row) => ((row.active) ?
												<span>
													<AntButton type="primary" size="small" icon="edit" onClick={(e) => this.editDetail(e, 'PRIMEFLIGHT', row.key, row.bcruledetailid)} />
													<AntButton type="danger" size="small" icon="delete" onClick={(e) => this.removeDetail(e, row.key)} />
												</span> : <Text strong type="warning">Inactive</Text>
											)}
											width="10%"
										/>
									</Table>
								</Col>
								<Col className="gutter-row" style={{ marginTop: 10 }} xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
									<Form.Item label="Setup Rule for Codeshare Flight">
										<Button type="primary" size="default" label="Setup Rule" htmlType="button" onClick={() => this.handleOpenModal('CODESHARE')} disabled={codeshareidfielddisalbled} />
									</Form.Item>
								</Col>
								<Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 20, offset: 2 }} xl={{ span: 20, offset: 2 }}>
									<Table dataSource={dataListCodeshareFlight} pagination={false} scroll={{ y: 240 }}>
										<Column
											title="Codeshare"
											key="codeshare"
											render={(value, row) => {
												if (actionspage === 'create') {
													let codeshare = (row) ? (row.codeshare.label) : null;
													if (codeshare) codeshare = codeshare.split("(")[0];
													return codeshare;
												} else {
													return `${row.codeshare.marketingairline}${(row.codeshare.marketingfltnum) ? ` ${row.codeshare.marketingfltnum}` : ''}*/${row.codeshare.operatingairline}${(row.codeshare.operatingfltnum) ? ` ${row.codeshare.operatingfltnum}` : ''}`;
												}
											}}
											width="14%"
										/>
										<Column
											title="Route"
											key="route"
											render={(value, row) => (
												(row.codeshare.routetype === 'SPECIFICROUTE') ?
													row.codeshare.originairportiatacode + "-" + row.codeshare.destinationairportiatacode : 'All Route'
											)}
											width="10%"
										/>
										<Column title="Award Miles" dataIndex="awardmilesfactor" key="awardmilesfactor" render={(value, row) => Math.round(value * 100) + "%"} width="8%" />
										<Column title="Tier Miles" dataIndex="tiermilesfactor" key="tiermilesfactor" render={(value, row) => Math.round(value * 100) + "%"} width="8%" />
										<Column title="Frequency" dataIndex="frequency" key="frequency" width="10%" />
										<Column title="Minimum Award Miles" dataIndex="minawardmiles" key="minawardmiles" width="10%" />
										<Column title="Minimum Tier Miles" dataIndex="mintiermiles" key="mintiermiles" width="10%" />
										<Column title="Effective Date" dataIndex="effectivedate" key="effectivedate" render={(value) => ((value) ? moment(value).format('DD/MM/YYYY') : '')} width="10%" />
										<Column title="Discontinue Date" dataIndex="discontinuedate" key="discontinuedate" render={(value) => ((value) ? moment(value).format('DD/MM/YYYY') : '')} width="10%" />
										<Column
											title="Action"
											key="action"
											render={(value, row) => ((row.codeshare.active) ?
												<span>
													<AntButton type="primary" size="small" icon="edit" onClick={(e) => this.editDetail(e, 'CODESHARE', row.key, row.bcruledetailid)} />
													<AntButton type="danger" size="small" icon="delete" onClick={(e) => this.removeDetail(e, row.key)} />
												</span> : <Text strong type="warning">Inactive</Text>
											)}
										/>
									</Table>
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
								<Button url="/accrual-rule-bc" htmlType="link" type="default" label="Back" />
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
// export default connect(mapStateToProps)(Layout);
export default connect(mapStateToProps)(Form.create()(App));