
import React, { Component } from 'react';
import { api } from '../../../config/Services';
import { connect } from 'react-redux';
import { SaveRequest, DeleteRequest, DetailRequest, RetrieveRequest } from '../../../utilities/RequestService';
import { Alert, Button, ErrorGeneral, InputText, AirlineSelect, SelectBase } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin, Modal } from 'antd';
import { RouteType } from '../../../data';
import RuleTable from './rule/Index';
import RuleForm from './rule/Form';
import { jsUcfirst } from '../../../utilities/Helpers';

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
            prruleid: null,
            prrule: [],
            prruledetailid: null,
            NewRouteType: [],
            active: false,
            fielddisabled: {
                generalfielddisabled: false,
                specialfielddisabled: false
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
            let generalfielddisabled = false;
            if (!usermenu[menucode][prefixmenuname + '_UPDATE']) {
                generalfielddisabled = true;
                titlepage = 'View';
                actionspage = 'view';
            }
            this.setState({ titlepage, actionspage, fielddisabled: { generalfielddisabled } });
            this.getDetail(id);
        } else {
            if (!usermenu[menucode][prefixmenuname + '_CREATE']) {
                this.setState({ responseMessage: `Sorry, your role can't perform this action`, formrender: false });
            } else {
                this.componentAirlineSelect.retrieveData();
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (prruleid) => {
        this.setState({ isLoading: true });
        DetailRequest(api.url.revenuebased.retrievedetail, { prruleid }).then((response) => {
            const { status = {}, result } = response || {};
            if (status.responsecode === "0000") {
                const { prrulename, airlinecode, routetype, prrule, prruleid, status } = result || {};
                let generalfielddisabled = (this.state.actionspage !== "view") ? !status : true;

                console.log('asasdasdasdsa')
                this.props.form.setFieldsValue({ prrulename, airlinecode, routetype });
                this.setState({ prrule, prrulename, prruleid, active: status, fielddisabled: { ...this.state.fielddisabled, generalfielddisabled } });
                this.componentAirlineSelect.retrieveData();
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
                const { prrulename, airlinecode, routetype } = input || null;
                const prruleid = this.props.match.params.ID;
                let prrule = this.state.prrule.map((obj) => {
                    let accrualbased = obj.accrualbased;
                    let startdate = obj.startdate;
                    let enddate = obj.enddate;
                    let active = true;
                    return { accrualbased, active, startdate, enddate };
                });

                let data = (actionspage === 'create') ? { prrulename, airlinecode, routetype, prrule } : { prrulename, airlinecode, routetype, prrule, prruleid };
                let url = (actionspage === 'create') ? api.url.revenuebased.create : api.url.revenuebased.update
                if (actionspage !== 'create') { data.prruleid = this.props.match.params.ID }

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

    activeDeactive = () => {
        const { active } = this.state;
        let url = (active) ? api.url.revenuebased.deactivate : api.url.revenuebased.activate;
        var callback = (response) => {
            const { status = {} } = response || {};
            if (status.responsecode === "0000") {
                Alert.success(status.responsemessage);
                this.props.history.push('/accrual-rule');
            } else {
                Alert.error(status.responsemessage);
            }
        };
        DeleteRequest(url, { prruleid: this.props.match.params.ID }, callback, active);
    }

    deleteData(prruledetailid) {
        let url = api.url.revenuebased.deleterule;
        let data = { prruledetailid };
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

    handleModal = (value, prruledetailid) => {
        this.setState({ showruleform: value, prruledetailid });
    }

    setTitlePage = (titleruleform) => {
        this.setState({ titleruleform });
    }

    handleSavePrice = (actionspricepage, value) => {
        const { actionspage } = this.state;
        if (actionspage === 'create') {
            if (actionspricepage === 'create') {
                let prrule = [...this.state.prrule, value];

                this.setState({ prrule, showruleform: false });
            } else if (actionspricepage === 'update') {
                let { prruledetailid, prrule } = this.state;

                prrule = prrule.map((obj, key) => {
                    if (obj.prruledetailid === prruledetailid) { obj = value }
                    return obj;
                });
                this.setState({ prrule, showruleform: false });
            }
        }
    }

    handleDeletePrice = (prruledetailid) => {
        let { prrule } = this.state;
        prrule = prrule.filter(obj => obj.prruledetailid !== prruledetailid);
        this.setState({ prrule });
    }

    handlePartner = (value) => {
        RetrieveRequest(api.url.revenuebased.retrieveheader, { airlinecode: value }).then((response) => {
            const { status = {}, result } = response || {};
            this.props.form.resetFields(['routetype', []]);
            this.setState({ isLoading: true })

            if (status.responsecode === "0000") {
                var RemoveRouteType = result.map(({ routetype }) => {
                    return {
                        label: jsUcfirst(routetype),
                        value: routetype
                    };
                });
                let NewRouteType = RouteType.filter(ar => !RemoveRouteType.find(rm => (rm.label === ar.label && ar.value === rm.value)))
                this.setState({ NewRouteType })
                if (NewRouteType.length === 0 && value) {
                    Alert.error('All route already created on this partner, Please choose another partner')
                }
            } else {
                Alert.error(status.responseMessage);
            }
            this.setState({ isLoading: false })
        })
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, actionspage, formrender, showruleform, prrule, isLoading, titleruleform, prruledetailid, prruleid, NewRouteType, active } = this.state;
        const { generalfielddisabled, specialfielddisabled } = this.state.fielddisabled;
        const { menucode, prefixmenuname } = this.props;
        const routetypedisableda = (this.props.form.getFieldValue('airlinecode') === undefined || NewRouteType.length === 0) ? true : specialfielddisabled;

        if (formrender) {
            document.title = titlepage + ' Partner Rule | Loyalty Management System';
            return (
                <Row>
                    <Modal visible={showruleform} title={titleruleform + ' Price'} onCancel={() => this.handleModal(false)} footer={null} destroyOnClose={true} width={680}>
                        <RuleForm prruledetailid={prruledetailid} menucode={menucode} prefixmenuname={prefixmenuname} actionsmasterpage={actionspage} datasource={prrule} actionspage={actionspage} handleSavePrice={this.handleSavePrice} handleRefresh={this.getDetail}
                            handleClose={() => this.handleModal(false)} setTitlePage={this.setTitlePage} prruleid={prruleid} active={active} />
                    </Modal>

                    <Spin spinning={isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <InputText labeltext='Rule Name' datafield='prrulename' form={this.props.form} maxLength={45} validationrules={['required', 'max.45']} disabled={generalfielddisabled} />
                                    <AirlineSelect ref={(e) => { this.componentAirlineSelect = e }} labeltext='Partner' datafield='airlinecode' form={this.props.form} validationrules={['required']} disabled={generalfielddisabled} onChange={this.handlePartner} />
                                    <SelectBase form={this.props.form} labeltext='Route Type' options={NewRouteType} datafield='routetype' validationrules={['required']} disabled={routetypedisableda} />
                                    <Form.Item label='Rule'>
                                        <Button htmlType='button' type='primary' size='default' label='Setup Rule' onClick={() => this.handleModal(true)} disabled={generalfielddisabled} />
                                    </Form.Item>
                                </Col>
                                <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 18, offset: 3 }} xl={{ span: 18, offset: 3 }}>
                                    <RuleTable {...this.props} datasource={prrule} actionspage={actionspage} handleRefresh={this.getDetail} handleEditPrice={this.handleModal} handleDelete={this.handleDeletePrice} active={active} />
                                </Col>
                            </Row>
                            <Row gutter={24} type='flex' justify='center' style={{ marginTop: 15 }}>
                                {actionspage === 'view' ? null : (active || actionspage === 'create' ? <Button htmlType='submit' type='primary' label='Save' menucode={menucode} prefixmenuname={prefixmenuname} actioncode={(actionspage === 'update') ? 'UPDATE' : 'CREATE'}></Button> : null)}
                                {
                                    (actionspage === 'update' && actionspage !== 'view') ?
                                        <Button htmlType='button' type='primary' label={active ? 'Deactive' : 'Active'} menucode={menucode} prefixmenuname={prefixmenuname} actioncode={'DELETE'}
                                            style={{ background: active ? 'red' : 'green', borderColor: active ? 'red' : 'green' }} onClick={this.activeDeactive} />
                                        : null
                                }
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