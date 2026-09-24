import React, { Component } from 'react';
import { RetrieveRequest, SaveRequest, DeleteRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import ErrorGeneral from '../../error/ErrorGeneral';
import { connect } from "react-redux";
import { InputText, Button, Alert, DateRangeBase, SwitchButton, TierCascender, UploadBase, SelectBase } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin, Card, Modal } from 'antd';
import { Tabs } from 'antd';
import moment from 'moment';
import CobrandBonus from '../cobrandbonus/Index';
import FastTrackUpgrade from '../fasttrack_upgrade/Index';

const { TabPane } = Tabs;
const { Title } = Typography;

const prefixmenuname = 'PARTCOBR';
const menucode = 'PARTCOBR';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            titlepage: 'Create',
            actionspage: 'create',
            responseCode: '0',
            responseMessage: '',
            formrender: true,
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false,
                starttierdisabled: true,
            },
            fieldvalue: {
                cobrandcode: null,
                urlcard: null,
                active: true
            },
            partnercode: this.props.location.state ? this.props.location.state.partnercode : null,
            partnername: this.props.location.state ? this.props.location.state.partnername : null,
            activepartner: this.props.location.state ? this.props.location.state.activepartner : null,
            visible: false
        }
    }

    checkPermission() {
        let id = this.props.match.params.ID;
        const { permission } = this.props;
        const { usermenu } = permission;
        if (id) {
            let titlepage = 'Edit';
            let actionspage = 'update';
            let specialfielddisabled = true;
            let generalfielddisabled = false;

            if (!usermenu[menucode][prefixmenuname + "_UPDATE"] || !this.state.activepartner) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
            }
            //change into update page
            let fielddisabled = { specialfielddisabled, generalfielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.getDetail(id, actionspage);
        } else {
            if (!usermenu[menucode][prefixmenuname + "_CREATE"])
                this.setState({ formrender: false });
            // } else {
            //     this.componentTierCascender.retrieveData();
            // }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (cobrandcode, actionspage) => {
        let url = api.url.partnercobrand.list;
        let criteria = { cobrandcode };
        //call loader
        this.setState({ loading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let partnercode = (result[0].partnercode) ? result[0].partnercode : '';
                    let cobrandcode = (result[0].cobrandcode) ? result[0].cobrandcode : '';
                    let cobrandname = (result[0].cobrandname) ? result[0].cobrandname : '';
                    let cobrandtype = (result[0].cobrandtype) ? result[0].cobrandtype : undefined;
                    let startdate = (result[0].startdate) ? moment(result[0].startdate) : null;
                    let enddate = (result[0].enddate) ? moment(result[0].enddate) : null;
                    let date = [startdate, enddate];
                    let isfasttrack = result[0].starttier ? true : false;
                    let terminatebyfile = result[0].terminatebyfile ? true : false;
                    let membershiptypeid = (result[0].membershiptypeid !== undefined) ? result[0].membershiptypeid : null;
                    let membershipid = (result[0].membershipid !== undefined) ? result[0].membershipid : null;
                    let starttier = (result[0].starttier !== undefined) ? result[0].starttier : null;
                    starttier = [membershiptypeid, membershipid, starttier];
                    let urlcard = result[0].cardtemplate ? result[0].cardtemplate : null;
                    let active = (result[0].active !== undefined) ? result[0].active : null;
                    let generalfielddisabled = (actionspage !== "view") ? !active : true;
                    let starttierdisabled = (isfasttrack && actionspage !== 'view') ? !active : true;

                    let setValue = { partnercode, cobrandcode, cobrandname, cobrandtype, date, isfasttrack, membershiptypeid, membershipid, starttier, terminatebyfile };
                    this.props.form.setFieldsValue(setValue);
                    let fieldvalue = { cobrandcode, urlcard, active };
                    let fielddisabled = { ...this.state.fielddisabled, generalfielddisabled, starttierdisabled };
                    this.setState({ fieldvalue, fielddisabled });

                    // if (this.props.location.state && this.props.location.state.partnercode)
                    //     this.componentTierCascender.retrieveData();
                } else {
                    this.setState({ responseMessage: 'Data not found', formrender: false });
                }
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
            this.setState({ loading: false });
        });
    }

    saveAction = (e) => {
        e.preventDefault();
        const { actionspage } = this.state;

        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ loading: true });
                let partnercode = this.state.partnercode;
                let cobrandcode = input.cobrandcode.toUpperCase();
                let cobrandname = input.cobrandname;
                let cobrandtype = input.cobrandtype;
                let terminatebyfile = (input.terminatebyfile) ? input.terminatebyfile : false;
                let membershiptypeid = (input.starttier && input.starttier[0]) ? input.starttier[0] : null;
                let membershipid = (input.starttier && input.starttier[1]) ? input.starttier[1] : null;
                let starttier = (input.starttier && input.starttier[2]) ? input.starttier[2] : null;
                let startdate = (input.date && input.date[0]) ? moment(input.date[0]).format("YYYY-MM-DD") : null;
                let enddate = (input.date && input.date[1]) ? moment(input.date[1]).format("YYYY-MM-DD") : null;

                let request = { partnercode, cobrandcode, cobrandname, cobrandtype, membershiptypeid, membershipid, starttier, startdate, enddate, terminatebyfile };

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.partnercobrand.create;
                } else {
                    message = 'Data has been updated';
                    url = api.url.partnercobrand.update;
                }

                /* Mapping Request File*/
                var fileRequest = new FormData();
                var file = (input.cardtemplate && input.cardtemplate[0] && input.cardtemplate[0]['originFileObj']) ? input.cardtemplate[0]['originFileObj'] : null;
                fileRequest.append("file", file);
                fileRequest.append("path", '/cobrand');

                SaveRequest(url, request, fileRequest).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push({ pathname: '/partner/cobrand', state: { partnercode: this.state.partnercode, partnername: this.state.partnername, activepartner: this.state.activepartner } });
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ loading: false });
                })
            }
        });
    };

    deleteData(cobrandcode, active) {
        let url = (active) ? api.url.partnercobrand.deactivate : api.url.partnercobrand.activate;
        let data = { cobrandcode };
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
        DeleteRequest(url, data, callback, active);
    }

    showModal = () => {
        this.setState({ visible: true });
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };

    onChangeFastTrack = (value) => {
        let starttierdisabled = !value;
        this.props.form.setFieldsValue({ starttier: undefined });
        this.setState({ fielddisabled: { ...this.state.fielddisabled, starttierdisabled } });
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, actionspage, formrender } = this.state;
        const { specialfielddisabled, generalfielddisabled, starttierdisabled } = this.state.fielddisabled;
        const { permission } = this.props;
        const { usermenu } = permission;
        const { cobrandcode, urlcard, active } = this.state.fieldvalue;
        const optionsCobrandType = [
            { value: 'DEBITCARD', label: 'Debit Card' },
            { value: 'CREDITCARD', label: 'Credit Card' },
            { value: 'OTHERS', label: 'Others' }
        ];

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " Partner Cobrand | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} Partner Cobrand</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.loading}>
                        <Tabs defaultActiveKey="1" style={{ marginTop: '-20px' }}>
                            <TabPane tab="Detail Information" key="1">
                                <Form {...formItemLayout} onSubmit={this.saveAction}>
                                    <Row gutter={24}>
                                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                            <InputText form={this.props.form} labeltext="Partner Name" datafield={this.state.partnername} defaultValue={this.state.partnername} validationrules={['required']} disabled />
                                            <InputText form={this.props.form} labeltext="Cobrand Code" datafield="cobrandcode" maxLength={20} validationrules={['required', 'pattern.alphanumeric']} disabled={specialfielddisabled} />
                                            <InputText form={this.props.form} labeltext="Cobrand Name" datafield="cobrandname" maxLength={45} validationrules={['required', 'pattern.letterspace']} disabled={generalfielddisabled} />
                                            <SelectBase form={this.props.form} labeltext="Cobrand Type" datafield="cobrandtype" options={optionsCobrandType} validationrules={['required']} disabled={generalfielddisabled} />
                                            <DateRangeBase form={this.props.form} labeltext="Date" datafield="date" placeholder={['Start Date', 'End Date']} validationrules={['required']} disabled={generalfielddisabled} minDate={moment(new Date()).add(1, 'day')} />
                                            {/* <SwitchButton form={this.props.form} labeltext="Is Fast Track?" datafield="isfasttrack" onChange={this.onChangeFastTrack} disabled={generalfielddisabled} defaultChecked={false} /> */}
                                            <SwitchButton form={this.props.form} labeltext="Terminate By File" datafield="terminatebyfile" disabled={generalfielddisabled} defaultChecked={false} />
                                            {/* <TierCascender ref={(e) => { this.componentTierCascender = e }} form={this.props.form} labeltext="Tier" datafield="starttier" validationrules={(!starttierdisabled) ? ['required'] : null} disabled={starttierdisabled} /> */}
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
                                                    <Card hoverable style={{ maxWidth: '360px' }} bodyStyle={{ display: 'none' }} cover={<img alt="Template Card" src={urlcard} />} />
                                                </Row>
                                            </Modal>
                                        </Col>
                                    </Row>
                                    <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                        {
                                            (actionspage !== 'view' && this.state.activepartner) ?
                                                (actionspage === 'create') ?
                                                    <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE"></Button>
                                                    : (actionspage === 'update' && active) ?
                                                        <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE"></Button>
                                                        : null : null
                                        }
                                        {
                                            (actionspage !== 'create') ?
                                                (active) ?
                                                    <Button htmlType="button" type="danger" label="Deactivate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(cobrandcode, active)} /> :
                                                    <Button htmlType="button" type="primary" label="Activate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(cobrandcode, active)} /> : ""
                                        }
                                        <Button url={{ pathname: '/partner/cobrand', state: { partnercode: this.state.partnercode, partnername: this.state.partnername, activepartner: this.state.activepartner } }} type="default" label="Back" />
                                    </Row>
                                </Form>
                            </TabPane>
                            {
                                (actionspage !== 'create' && usermenu["COBBONUS"]["COBBONUS_ACCESS"]) ?
                                    < TabPane tab="Cobrand Bonus" key="2">
                                        <CobrandBonus cobrandcode={this.props.match.params.ID} partnercode={this.state.partnercode} activecobrand={active} activepartner={this.state.activepartner} />
                                    </TabPane> : ""
                            }
                            {
                                (actionspage !== 'create' && usermenu["FTRACK"]["FTRACK_ACCESS"]) ?
                                    < TabPane tab="Fast Track Upgrade" key="3">
                                        <FastTrackUpgrade cobrandcode={this.props.match.params.ID} activecobrand={active} activepartner={this.state.activepartner} />
                                    </TabPane> : ''
                            }
                        </Tabs>
                    </Spin >
                </Row >
            )
        } else {
            return (<ErrorGeneral {...this.props} message={this.state.responseMessage} />);
        }
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));