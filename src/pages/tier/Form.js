import React, { Component } from 'react';
import { RetrieveRequest, SaveRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import ErrorGeneral from '../error/ErrorGeneral';
import { connect } from "react-redux";
import { InputText, MembershipSelect, SwitchButton, TierSelect, TierReasonSelect, DateRangeBase, Button, UploadBase, Alert } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin, Card, Modal } from 'antd';
import moment from 'moment';

const { Title } = Typography;

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
                urlCard: null
            },
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false,
                previoustieriddisabled: false,
                upgradereasondisabled: true
            },
            visible: false
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
            let fielddisabled = { specialfielddisabled, generalfielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.getDetail(id, actionspage);
        } else {
            if (!usermenu[menucode][prefixmenuname + "_CREATE"]) {
                this.setState({ formrender: false });
            } else {
                this.componentMembershipSelect.retrieveData();
                this.componentPreviousTierSelect.retrieveData();
                this.componentNextTierSelect.retrieveData();
                this.componentUpgradeTierReasonSelect.retrieveData();
                this.componentDowngradeTierReasonSelect.retrieveData();
                this.componentMaintainTierReasonSelect.retrieveData();
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (tierid, actionspage) => {
        let url = api.url.tier.list;
        let criteria = { tierid };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let tierid = result[0].tierid ? result[0].tierid : '';
                    let tiername = result[0].tiername ? result[0].tiername : undefined;
                    let spendmileage = result[0].spendmileage ? result[0].spendmileage : false;
                    let membershipid = result[0].membershipid ? result[0].membershipid : undefined;
                    let firsttier = result[0].firsttier ? result[0].firsttier : false;
                    let previoustierid = result[0].previoustierid ? result[0].previoustierid : undefined;
                    let nexttierid = result[0].nexttierid ? result[0].nexttierid : undefined;
                    let annualfee = result[0].annualfee ? result[0].annualfee.toString() : undefined;
                    let upgradable = result[0].upgradable ? result[0].upgradable : false;
                    let upgradereasonid = result[0].upgradereasonid ? result[0].upgradereasonid : undefined;
                    let downgradereasonid = result[0].downgradereasonid ? result[0].downgradereasonid : undefined;
                    let maintainreasonid = result[0].maintainreasonid ? result[0].maintainreasonid : undefined;
                    let effectivedate = result[0].effectivedate ? moment(result[0].effectivedate) : undefined;
                    let discontinuedate = result[0].discontinuedate ? moment(result[0].discontinuedate) : undefined;
                    let date = [effectivedate, discontinuedate];
                    let urlCard = result[0].templatecard ? result[0].templatecard : null;

                    let setValue = {
                        tierid, tiername, spendmileage, membershipid, firsttier, previoustierid, nexttierid, annualfee,
                        upgradable, upgradereasonid, downgradereasonid, maintainreasonid, date
                    };
                    this.props.form.setFieldsValue(setValue);

                    let previoustieriddisabled = (!firsttier && actionspage !== 'view') ? false : true;
                    let upgradereasondisabled = (upgradable && actionspage !== 'view') ? false : true;
                    this.setState({
                        fieldvalue: { ...this.state.fieldvalue, urlCard },
                        fielddisabled: { ...this.state.fielddisabled, previoustieriddisabled, upgradereasondisabled }
                    });

                    this.componentMembershipSelect.retrieveData();
                    this.componentPreviousTierSelect.retrieveData();
                    this.componentNextTierSelect.retrieveData();
                    this.componentUpgradeTierReasonSelect.retrieveData();
                    this.componentDowngradeTierReasonSelect.retrieveData();
                    this.componentMaintainTierReasonSelect.retrieveData();
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
                let tierid = input.tierid.toUpperCase();
                let tiername = input.tiername;
                let spendmileage = (input.spendmileage !== undefined) ? input.spendmileage : false;
                let membershipid = input.membershipid;
                let firsttier = (input.firsttier !== undefined) ? input.firsttier : false;
                let previoustierid = (input.previoustierid !== undefined) ? input.previoustierid : null;
                let nexttierid = (input.nexttierid !== undefined) ? input.nexttierid : null;
                let annualfee = (input.annualfee !== undefined && input.annualfee.length > 0) ? input.annualfee : null;
                let upgradable = (input.upgradable !== undefined) ? input.upgradable : false;
                let upgradereasonid = (input.upgradereasonid !== undefined) ? input.upgradereasonid : null;
                let downgradereasonid = (input.downgradereasonid !== undefined) ? input.downgradereasonid : null;
                let maintainreasonid = (input.maintainreasonid !== undefined) ? input.maintainreasonid : null;
                let effectivedate = (input.date && input.date[0]) ? moment(input.date[0]).format("YYYY-MM-DD") : null;
                let discontinuedate = (input.date && input.date[1]) ? moment(input.date[1]).format("YYYY-MM-DD") : null;

                let request = { tierid, tiername, spendmileage, membershipid, firsttier, previoustierid, nexttierid, annualfee, upgradable, upgradereasonid, downgradereasonid, maintainreasonid, effectivedate, discontinuedate };

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.tier.create;
                } else {
                    message = 'Data has been updated';
                    url = api.url.tier.update;
                }

                /* Mapping Request File*/
                var fileRequest = new FormData();
                var file = (input.cardtemplate && input.cardtemplate[0] && input.cardtemplate[0]['originFileObj']) ? input.cardtemplate[0]['originFileObj'] : null;
                fileRequest.append("file", file);
                fileRequest.append("path", '/cards');
                
                SaveRequest(url, request, fileRequest).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/tier');
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        });
    };

    onChangeFirstTier = (value) => {
        let previoustieriddisabled = value;
        this.props.form.setFieldsValue({ previoustierid: undefined });
        this.setState({ fielddisabled: { ...this.state.fielddisabled, previoustieriddisabled } })
    }

    onChangeUpgradable = (value) => {
        let upgradereasondisabled = !value;
        this.props.form.setFieldsValue({ upgradereasonid: undefined });
        this.setState({ fielddisabled: { ...this.state.fielddisabled, upgradereasondisabled } })
    }


    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, actionspage, formrender } = this.state;
        const { specialfielddisabled, generalfielddisabled, previoustieriddisabled, upgradereasondisabled } = this.state.fielddisabled;
        const { urlCard } = this.state.fieldvalue;
        const { menucode, prefixmenuname } = this.props;

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " Tier | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} Tier</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <InputText form={this.props.form} labeltext="Tier ID" datafield="tierid" validationrules={['required', 'pattern.alphanumeric', 'max.20',]} maxLength={20} disabled={specialfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Tier Name" datafield="tiername" validationrules={['required', 'pattern.alphanumericspace', 'max.45',]} maxLength={45} disabled={generalfielddisabled} />
                                    <SwitchButton form={this.props.form} labeltext="Spend Mileage" datafield="spendmileage" disabled={generalfielddisabled} />
                                    <MembershipSelect ref={(e) => { this.componentMembershipSelect = e }} form={this.props.form} labeltext="Membership" datafield="membershipid" validationrules={['required']} disabled={generalfielddisabled} />
                                    <SwitchButton form={this.props.form} labeltext="First Tier" datafield="firsttier" onChange={this.onChangeFirstTier} disabled={generalfielddisabled} />
                                    <TierSelect ref={(e) => { this.componentPreviousTierSelect = e }} form={this.props.form} labeltext="Previous Tier" datafield="previoustierid" validationrules={(!previoustieriddisabled) ? ['required'] : null} disabled={previoustieriddisabled} />
                                    <TierSelect ref={(e) => { this.componentNextTierSelect = e }} form={this.props.form} labeltext="Next Tier" datafield="nexttierid" disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Annual Fee" datafield="annualfee" validationrules={['pattern.number', 'max.45']} maxLength={45} disabled={generalfielddisabled} />
                                    <SwitchButton form={this.props.form} labeltext="Upgradable" datafield="upgradable" onChange={this.onChangeUpgradable} disabled={generalfielddisabled} />
                                    <TierReasonSelect ref={(e) => { this.componentUpgradeTierReasonSelect = e }} form={this.props.form} labeltext="Upgrade Reason" datafield="upgradereasonid" validationrules={(!upgradereasondisabled) ? ['required'] : null} disabled={upgradereasondisabled} />
                                    <TierReasonSelect ref={(e) => { this.componentDowngradeTierReasonSelect = e }} form={this.props.form} labeltext="Downgrade Reason" datafield="downgradereasonid" validationrules={['required']} disabled={generalfielddisabled} />
                                    <TierReasonSelect ref={(e) => { this.componentMaintainTierReasonSelect = e }} form={this.props.form} labeltext="Maintain Reason" datafield="maintainreasonid" validationrules={['required']} disabled={generalfielddisabled} />
                                    <DateRangeBase form={this.props.form} labeltext="Date" datafield="date" placeholder={['Effective Date', 'Discontinue Date']} minDate={moment().add(1, 'day')} validationrules={['required']} disabled={generalfielddisabled} />
                                    <Row gutter={24}>
                                        <Col className="gutter-row" xl={16} md={16} sm={24} >
                                            <UploadBase labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} form={this.props.form} labeltext="Card Template" validationrules={(actionspage === 'create') ? ['required'] : []} datafield="cardtemplate" disabled={generalfielddisabled} />
                                        </Col>
                                        {
                                            (actionspage !== 'create') ?
                                                <Col className="gutter-row" xl={8} md={8} sm={24} style={{ lineHeight: '40px' }}>
                                                    <Button htmlType="button" label="Show Card" type="primary" onClick={this.showModal} />
                                                </Col> : null
                                        }
                                    </Row>
                                    <Modal title="Show Card Template" visible={this.state.visible} onCancel={this.handleCancel} footer={null} destroyOnClose={true} >
                                        <Row type="flex" justify="center">
                                            <Card hoverable style={{ maxWidth: '360px' }} bodyStyle={{ display: 'none' }} cover={<img alt="Template Card" src={urlCard} />} />
                                        </Row>
                                    </Modal>
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
                                <Button url="/tier" htmlType="link" type="default" label="Back" />
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