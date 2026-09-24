
import React, { Component } from 'react';
import { api } from '../../../config/Services';
import { connect } from 'react-redux';
import { SaveRequest, DeleteRequest, DetailRequest } from '../../../utilities/RequestService';
import { Alert, Button, ErrorGeneral, InputText } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin, Modal } from 'antd';

import RateTable from './rate/Index';
import RateForm from './rate/Form';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            titlepage: 'Create',
            titleruleform: 'Create',
            actionspage: 'create',
            formrender: true,
            showruleform: false,
            rate: [],
            rateconversionid: null,
            rateconversdetailid: null,
            fielddisabled: {
                generalfielddisabled: false,
            }
        }
    }

    checkPermission = (rateconversionid) => {
        const { menucode, permission, prefixmenuname, active } = this.props;
        const { usermenu } = permission;
        if (rateconversionid) {
            let titlepage = 'Edit';
            let actionspage = 'update';
            let generalfielddisabled = false;
            if (!usermenu[menucode][prefixmenuname + '_UPDATE'] || !active) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
            }
            this.setState({ titlepage, actionspage, fielddisabled: { generalfielddisabled }, prruleid: this.props.match.params.ID });
        } else {
            if (!usermenu[menucode][prefixmenuname + '_CREATE']) {
                this.setState({ responseMessage: `Sorry, your role can't perform this action`, formrender: false });
            }
        }
    }

    componentDidMount() {
        this.getDetail();
    }

    getDetail = () => {
        let prruleid = this.props.match.params.ID;
        this.setState({ isLoading: true });
        DetailRequest(api.url.revenuebased.rate.retrievedetail, { prruleid }).then((response) => {
            const { status = {}, result } = response || {};
            if (status.responsecode === "0000") {
                const { rateconversionname, rate, rateconversionid } = result || {};

                this.checkPermission(rateconversionid);
                this.props.form.setFieldsValue({ rateconversionname });
                this.setState({ rate, rateconversionid });
            } else if (status.responsedesc === "Data Not Found") {
                let rateconversionid = null;
                this.checkPermission(rateconversionid);
            } else {
                Alert.error(status.responsemessage);
                this.setState({ formrender: false });
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
                const { rateconversionname } = input || null;
                let rate = this.state.rate.map((obj) => {
                    let price = obj.price ? Number(obj.price) : 0;
                    let awardmiles = obj.awardmiles ? Number(obj.awardmiles) : 0;
                    let tiermiles = obj.tiermiles ? Number(obj.tiermiles) : 0;
                    let frequency = obj.frequency ? Number(obj.frequency) : 0;
                    let currency = obj.currency;
                    let startdate = obj.startdate;
                    let enddate = obj.enddate;
                    let active = true;
                    return { price, active, startdate, enddate, awardmiles, tiermiles, frequency, currency };
                });

                let data = (actionspage === 'create') ? { rateconversionname, rate, prruleid: this.props.match.params.ID } :
                    { rateconversionid: this.state.rateconversionid, rateconversionname, rate, prruleid: this.props.match.params.ID };
                let url = (actionspage === 'create') ? api.url.revenuebased.rate.create : api.url.revenuebased.rate.update

                SaveRequest(url, data).then((response) => {
                    const { status = {} } = response || {};
                    if (status.responsecode === "0000") {
                        Alert.success(status.responsemessage);
                        this.props.history.push('/accrual-rule');
                    } else {
                        Alert.error(status.responsemessage);
                    }
                    this.setState({ isLoading: false });
                })
            }
        });
    }

    deleteData(rateconversdetailid) {
        let url = api.url.revenuebased.rate.deleterule;
        let data = { rateconversdetailid };
        var callback = (response) => {
            const { status = {} } = response || {};
            if (status.responsecode === "0000") {
                Alert.success(status.responsemessage);
            } else {
                Alert.error(status.responsemessage);
            }
            this.checkPermission();
        };
        DeleteRequest(url, data, callback);
    }

    handleModal = (value, rateconversdetailid) => {
        this.setState({ showruleform: value, rateconversdetailid });
    }

    setTitlePage = (titleruleform) => {
        this.setState({ titleruleform });
    }

    handleSavePrice = (actionspricepage, value) => {
        const { actionspage } = this.state;
        if (actionspage === 'create') {
            if (actionspricepage === 'create') {
                let rate = [...this.state.rate, value];
                this.setState({ rate, showruleform: false });
            } else if (actionspricepage === 'update') {
                let { rateconversdetailid, rate } = this.state;

                rate = rate.map((obj, key) => {
                    if (obj.rateconversdetailid === rateconversdetailid) { obj = value }
                    return obj;
                });
                this.setState({ rate, showruleform: false });
            }
        }
    }

    handleDeletePrice = (rateconversdetailid) => {
        let { rate } = this.state;
        rate = rate.filter(obj => obj.rateconversdetailid !== rateconversdetailid);
        this.setState({ rate });
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, actionspage, formrender, showruleform, rate, isLoading, titleruleform, rateconversionid, rateconversdetailid, prruleid } = this.state;
        const { generalfielddisabled } = this.state.fielddisabled;
        const { menucode, prefixmenuname } = this.props;

        if (formrender) {
            document.title = titlepage + ' Partner Rule | Loyalty Management System';
            //render form
            return (
                <Row>
                    <Modal visible={showruleform} title={titleruleform + ' Rate Conversion'} onCancel={() => this.handleModal(false)} footer={null} destroyOnClose={true} width={680}>
                        <RateForm rateconversdetailid={rateconversdetailid} rateconversionid={rateconversionid} menucode={menucode} prefixmenuname={prefixmenuname} actionsmasterpage={actionspage} datasource={rate} actionspage={actionspage}
                            handleSavePrice={this.handleSavePrice} handleRefresh={this.getDetail} handleClose={() => this.handleModal(false)} setTitlePage={this.setTitlePage} prruleid={prruleid} />
                    </Modal>

                    <Spin spinning={isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <InputText labeltext='Conversion Name' datafield='rateconversionname' form={this.props.form} maxLength={45} validationrules={['required', 'max.45']} disabled={generalfielddisabled} />
                                    <Form.Item label='Rate Conversion'>
                                        <Button htmlType='button' type='primary' size='default' label='Setup Rate' onClick={() => this.handleModal(true)} disabled={generalfielddisabled} />
                                    </Form.Item>
                                </Col>
                                <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 18, offset: 3 }} xl={{ span: 18, offset: 3 }}>
                                    <RateTable {...this.props} datasource={rate} actionspage={actionspage} handleRefresh={this.getDetail} handleEditPrice={this.handleModal} handleDelete={this.handleDeletePrice} />
                                </Col>
                            </Row>
                            <Row gutter={24} type='flex' justify='center' style={{ marginTop: 15 }}>
                                {actionspage === 'view' ? null : <Button htmlType='submit' type='primary' label='Save' menucode={menucode} prefixmenuname={prefixmenuname} actioncode={(actionspage === 'update') ? 'UPDATE' : 'CREATE'}></Button>}
                                <Button url='/accrual-rule' htmlType='link' type='default' label='Back' />
                            </Row>
                        </Form>
                    </Spin>
                </Row>
            )
        } else {
            return (<ErrorGeneral {...this.props} message={"Please try again later"} />);
        }
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));