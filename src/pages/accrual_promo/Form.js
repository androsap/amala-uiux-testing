
import React, { Component } from 'react';
import { api } from '../../config/Services';
import { connect } from "react-redux";
import { DetailRequest, SaveRequest, DeleteRequest } from '../../utilities/RequestService';
import { Alert, Button, ErrorGeneral, InputText, DateRangeBase, ProgramSelect, TierSelect, AirlineSelect, SelectBase, SwitchButton, CorporateSelect } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin, Table, Modal, Button as AntButton } from 'antd';
import moment from 'moment';
import RouteList from './RouteList';
import SubclassList from './SubclassList';

const { Title } = Typography;
const { Column } = Table;

const optionsChannel = [
    { label: 'All', value: 'ALL' },
    { label: 'Website', value: 'WEBSITE' },
    { label: 'Mobile', value: 'MOBILE' }
]

const optionsSegment = [
    { label: 'All', value: 'ALL' },
    { label: 'Specific', value: 'SPECIFIC' },
    { label: 'Not Available', value: 'NOT_AVAILABLE' }
]

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            titlepage: 'Create',
            actionspage: 'create',
            formrender: true,
            fieldvalue: {
                showroutemodal: false,
                routelist: [],
                flightscheduleidselected: [],
                showsubclassmodal: false,
                subclasslist: [],
                subclasscodeselected: [],
                corporatecode: [],
                corporateOptions: []
            },
            fielddisabled: {
                generalfielddisabled: false,
                specialfielddisabled: false,
                setuproutedisabled: true,
                setupsubclassdisabled: true,
                retrodatedissabled: true,
                corporatedisabled: true,
            }
        }

        this.handleOpenRouteModal = this.handleOpenRouteModal.bind(this);
        this.handleRemoveRoute = this.handleRemoveRoute.bind(this);
        this.handleAirlineChange = this.handleAirlineChange.bind(this);
        this.handleOpenSubclassModal = this.handleOpenSubclassModal.bind(this);
    }

    checkPermission() {
        let id = this.props.match.params.ID;
        const { menucode, permission, prefixmenuname } = this.props;
        const { usermenu } = permission;
        if (id) {
            let titlepage = 'Edit';
            let actionspage = 'update';
            let generalfielddisabled = false;
            let specialfielddisabled = true;

            if (!usermenu[menucode][prefixmenuname + "_UPDATE"]) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
            }
            //change into update page
            let fielddisabled = { generalfielddisabled, specialfielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.getDetail(id, actionspage);
        } else {
            if (!usermenu[menucode][prefixmenuname + "_CREATE"]) {
                this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
            } else {
                this.componentProgramSelect.retrieveData();
                this.componentTierSelect.retrieveWithMembership();
                this.componentAirlineSelect.retrieveData();
                this.componentCorporateSelect.retrieveData();
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (promocode, actionspage) => {

        let url = api.url.accrualpromo.detail;
        let data = { promocode };
        //call loader
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                let promocode = (result.promocode) ? result.promocode : null;
                let promoname = (result.promoname) ? result.promoname : null;
                let bookingchannel = (result.bookingchannel) ? result.bookingchannel : undefined;
                let programcode = (result.promoprogramlist) ? result.promoprogramlist.map((obj, key) => { return obj.programcode }) : [];
                let tierid = (result.promotierlist) ? result.promotierlist.map((obj, key) => { return obj.tierid }) : [];
                let corporatesegment = (result.corporatesegment) ? result.corporatesegment : undefined;
                let corporatecode = (result.promocorporatelist) ? result.promocorporatelist.map((obj, key) => { return obj.corporatecode }) : [];
                let startdoi = (result.startdoi) ? moment(result.startdoi) : null;
                let enddoi = (result.enddoi) ? moment(result.enddoi) : null;
                let doi = [startdoi, enddoi];
                let startdot = (result.startdot) ? moment(result.startdot) : null;
                let enddot = (result.enddot) ? moment(result.enddot) : null;
                let dot = [startdot, enddot];
                let startretroperiod = (result.startretroperiod) ? moment(result.startretroperiod) : null;
                let endretroperiod = (result.endretroperiod) ? moment(result.endretroperiod) : null;
                let date = [startretroperiod, endretroperiod];
                let eligibleforretro = (startretroperiod && endretroperiod) ? true : false;
                let awardmilesfactor = (result.awardmilesfactor !== undefined) ? Number.parseInt(result.awardmilesfactor * 100, 0) : undefined;
                let tiermilesfactor = (result.tiermilesfactor !== undefined) ? Number.parseInt(result.tiermilesfactor * 100, 0) : undefined;
                let frequencyfactor = (result.frequencyfactor !== undefined) ? Number.parseInt(result.frequencyfactor * 100, 0) : undefined;
                /* check airlinecode from subclass or route */
                let airlinecode = (result.promoroutelist.length > 0 && result.promoroutelist[0] && result.promoroutelist[0]["airlinecode"]) ? result.promoroutelist[0]["airlinecode"] : undefined;
                airlinecode = (airlinecode) ? airlinecode : (result.subclasscode.length > 0 && result.subclasscode[0] && result.subclasscode[0]["airlinecode"]) ? result.subclasscode[0]["airlinecode"] : undefined;

                let setValue = { promocode, promoname, bookingchannel, programcode, tierid, corporatesegment, corporatecode, doi, dot, date, awardmilesfactor, tiermilesfactor, frequencyfactor, airlinecode, eligibleforretro };
                this.props.form.setFieldsValue(setValue);

                const routelist = (result.promoroutelist) ? result.promoroutelist : [];
                const flightscheduleidselected = (result.promoroutelist) ? result.promoroutelist.map((obj, key) => { return obj.flightscheduleid }) : [];
                const subclasslist = (result.subclasscode) ? result.subclasscode : [];
                const subclasscodeselected = (result.subclasscode) ? result.subclasscode.map((obj, key) => { return obj.compartmentcode + "" + obj.subclasscode }) : [];

                const setuproutedisabled = (actionspage !== "view") ? (airlinecode) ? false : true : true;
                const setupsubclassdisabled = (actionspage !== "view") ? (airlinecode) ? false : true : true;
                const retrodatedissabled = (actionspage !== "view") ? (eligibleforretro) ? false : true : true;
                const corporatedisabled = (actionspage !== "update") ? false : corporatecode.length === 0 ? true : false;
                
                const fieldvalue = { ...this.state.fieldvalue, routelist, flightscheduleidselected, subclasslist, subclasscodeselected, corporatecode, corporatesegment };
                const fielddisabled = { ...this.state.fielddisabled, setuproutedisabled, setupsubclassdisabled, retrodatedissabled, corporatedisabled };
                this.setState({ fieldvalue, fielddisabled });
                //add select inactive
                this.componentProgramSelect.retrieveData();
                this.componentTierSelect.retrieveWithMembership();
                this.componentAirlineSelect.retrieveData();
                this.componentCorporateSelect.retrieveData();
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
                const { flightscheduleidselected, subclasslist } = this.state.fieldvalue;
                this.setState({ isLoading: true });
                //define parameter
                let promocode = (input.promocode) ? (input.promocode).toUpperCase() : null;
                let promoname = (input.promoname) ? input.promoname : null;
                let bookingchannel = (input.bookingchannel) ? input.bookingchannel : null;
                let programcode = (input.programcode) ? input.programcode : [];
                let tierid = (input.tierid) ? input.tierid : [];
                let corporatesegment = (input.corporatesegment) ? input.corporatesegment : null;
                let corporatecode = (input.corporatecode) ? input.corporatecode : [];
                let startdoi = (input.doi && input.doi[0]) ? moment(input.doi[0]).format("YYYY-MM-DD") : null;
                let enddoi = (input.doi && input.doi[1]) ? moment(input.doi[1]).format("YYYY-MM-DD") : null;
                let startdot = (input.dot && input.dot[0]) ? moment(input.dot[0]).format("YYYY-MM-DD") : null;
                let enddot = (input.dot && input.dot[1]) ? moment(input.dot[1]).format("YYYY-MM-DD") : null;
                let startretroperiod = (input.date && input.date[0]) ? moment(input.date[0]).format("YYYY-MM-DD") : null;
                let endretroperiod = (input.date && input.date[1]) ? moment(input.date[1]).format("YYYY-MM-DD") : null;
                let awardmilesfactor = (input.awardmilesfactor !== undefined && input.awardmilesfactor !== null) ? Number.parseFloat(input.awardmilesfactor / 100) : null;
                let tiermilesfactor = (input.tiermilesfactor !== undefined && input.tiermilesfactor !== null) ? Number.parseFloat(input.tiermilesfactor / 100) : null;
                let frequencyfactor = (input.frequencyfactor !== undefined && input.frequencyfactor !== null) ? Number.parseFloat(input.frequencyfactor / 100) : null;
                let eligibleforretro = (input.eligibleforretro) ? input.eligibleforretro : false;
                let route = (flightscheduleidselected.length > 0) ? flightscheduleidselected : [];
                let subclasscode = subclasslist.map((obj, key) => {
                    const airlinecode = (obj.airlinecode) ? obj.airlinecode : null;
                    const compartmentcode = (obj.compartmentcode) ? obj.compartmentcode : null;
                    const subclasscode = (obj.subclasscode) ? obj.subclasscode : null;

                    return { airlinecode, compartmentcode, subclasscode };
                });

                let data = {
                    promocode, promoname, bookingchannel, programcode, tierid, corporatesegment, corporatecode, startdoi, enddoi, startdot, enddot, startretroperiod, endretroperiod,
                    awardmilesfactor, tiermilesfactor, frequencyfactor, route, subclasscode, eligibleforretro
                };

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.accrualpromo.create;
                } else {
                    data.promocode = this.props.match.params.ID;
                    message = 'Data has been updated';
                    url = api.url.accrualpromo.update;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/accrual-promo');
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        });
    }

    deleteData(promocode, active) {
        let url = (active) ? api.url.accrualpromo.deactivate : api.url.accrualpromo.activate;
        let data = { promocode };
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

    handleOpenRouteModal = () => {
        this.setState({ fieldvalue: { ...this.state.fieldvalue, showroutemodal: true } });
    }

    handleCloseRouteModal = () => {
        this.setState({ fieldvalue: { ...this.state.fieldvalue, showroutemodal: false } });
    }

    handleAddRoute = async (routelist) => {
        const flightscheduleidselected = routelist.map((obj, key) => { return obj.flightscheduleid });
        const fieldvalue = { ...this.state.fieldvalue, routelist, flightscheduleidselected };
        await this.setState({ fieldvalue });
        await this.handleCloseRouteModal();
    }

    handleRemoveRoute = (e, flightscheduleid) => {
        e.preventDefault();
        let { routelist } = this.state.fieldvalue;
        routelist = routelist.filter(obj => obj.flightscheduleid !== flightscheduleid);

        const flightscheduleidselected = routelist.map((obj, key) => { return obj.flightscheduleid });
        const fieldvalue = { ...this.state.fieldvalue, routelist, flightscheduleidselected };
        this.setState({ fieldvalue });
    }

    handleAirlineChange = (airlinecode) => {
        const routelist = [];
        const flightscheduleidselected = [];
        const subclasslist = [];
        const subclasscodeselected = [];
        const setuproutedisabled = (airlinecode) ? false : true;
        const setupsubclassdisabled = (airlinecode) ? false : true;
        const fieldvalue = { ...this.state.fieldvalue, routelist, flightscheduleidselected, subclasslist, subclasscodeselected };
        const fielddisabled = { ...this.state.fielddisabled, setuproutedisabled, setupsubclassdisabled };
        this.setState({ fieldvalue, fielddisabled });
    }

    handleOpenSubclassModal = () => {
        this.setState({ fieldvalue: { ...this.state.fieldvalue, showsubclassmodal: true } });
    }

    handleCloseSubclassModal = () => {
        this.setState({ fieldvalue: { ...this.state.fieldvalue, showsubclassmodal: false } });
    }

    handleAddSubclass = async (subclasslist) => {
        const subclasscodeselected = subclasslist.map((obj, key) => { return obj.compartmentcode + "" + obj.subclasscode });
        const fieldvalue = { ...this.state.fieldvalue, subclasslist, subclasscodeselected };
        await this.setState({ fieldvalue });
        await this.handleCloseSubclassModal();
    }

    handleRemoveSubclass = async (e, compartmentcode, subclasscode) => {
        e.preventDefault();
        let { subclasslist } = this.state.fieldvalue;
        subclasslist = await subclasslist.filter(obj => { return obj.subclasscode !== subclasscode });

        const subclasscodeselected = await subclasslist.map((obj, key) => { return obj.compartmentcode + "" + obj.subclasscode });
        const fieldvalue = { ...this.state.fieldvalue, subclasslist, subclasscodeselected };
        await this.setState({ fieldvalue });
    }

    handleIsEligibleForRetro = (eligibleforretro) => {
        let retrodatedissabled = (eligibleforretro) ? false : true;

        this.setState({ fielddisabled: { ...this.state.fielddisabled, retrodatedissabled } });
        if (!eligibleforretro) this.props.form.setFieldsValue({ date: [null, null] });
    }

    onChangeSegment = (corporatesegment) => {
        let corporatedisabled = (corporatesegment === 'SPECIFIC') ? false : true;
        this.setState({ fielddisabled: { ...this.state.fielddisabled, corporatedisabled } });
        const { fieldvalue, actionspage } = this.state;
        const { corporateOptions} = fieldvalue;
        console.log('corporateOptions', corporateOptions);
        if (corporatesegment === 'ALL') this.props.form.setFieldsValue({ corporatecode: corporateOptions });
        if (corporatesegment === 'NOT_AVAILABLE' || corporatesegment === 'SPECIFIC') this.props.form.resetFields(['corporatecode', []]);
    }

    corporateOptions = (options) => {
        const {corporatecode} = this.state.fieldvalue;
        let corporateOptions = [];
        for (let i = 0; i < options.length; i++) {
            corporateOptions.push(options[i].value);
        }
        const fieldvalue = { ...this.state.fieldvalue, corporateOptions};
        const fielddisabled = { ...this.state.fielddisabled, corporatedisabled: (corporatecode.length === options.length) ? true : (corporatecode.length === 0) ? true : false};
        this.setState({ fielddisabled, fieldvalue });
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, actionspage, formrender, fieldvalue } = this.state;
        const { showroutemodal, routelist, flightscheduleidselected, showsubclassmodal, subclasslist, subclasscodeselected } = fieldvalue;
        const { generalfielddisabled, specialfielddisabled, setuproutedisabled, corporatedisabled, retrodatedissabled } = this.state.fielddisabled;
        const { menucode, prefixmenuname } = this.props;
        const airlinecode = this.props.form.getFieldValue('airlinecode');
        const eligibleforretro = this.props.form.getFieldValue('eligibleforretro');
        const corporatesegment = this.props.form.getFieldValue('corporatesegment');

        if (formrender) {
            document.title = titlepage + " Accrual Promo | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Modal visible={showroutemodal} title="Route" onCancel={this.handleCloseRouteModal} footer={null} destroyOnClose={true} width={960}>
                        <RouteList {...this.props} ref={(e) => { this.componentRouteList = e }} airlinecode={airlinecode} handleAddRoute={this.handleAddRoute} handleRemoveRoute={() => this.handleRemoveRoute} defaultRowSelected={routelist} defaultRowSelectedKey={flightscheduleidselected} />
                    </Modal>
                    <Modal visible={showsubclassmodal} title="Subclass" onCancel={this.handleCloseSubclassModal} footer={null} destroyOnClose={true} width={760}>
                        <SubclassList {...this.props} ref={(e) => { this.componentRouteList = e }} airlinecode={airlinecode} handleAdd={this.handleAddSubclass} defaultRowSelected={subclasslist} defaultRowSelectedKey={subclasscodeselected} />
                    </Modal>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} Accrual Promo</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <InputText form={this.props.form} labeltext="Promo Code" datafield="promocode" maxLength={20} validationrules={['required', 'pattern.alphanumeric']} disabled={specialfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Promo Name" datafield="promoname" maxLength={50} validationrules={['required', 'pattern.alphanumericspace']} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Award Miles Bonus" datafield="awardmilesfactor" suffix="%" maxLength={10} validationrules={['required', 'pattern.number']} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Tier Miles Bonus" datafield="tiermilesfactor" suffix="%" maxLength={10} validationrules={['required', 'pattern.number']} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Frequency Bonus" datafield="frequencyfactor" suffix="%" maxLength={10} validationrules={['required', 'pattern.number']} disabled={generalfielddisabled} />
                                    <SelectBase form={this.props.form} labeltext="Booking Channel" datafield="bookingchannel" options={optionsChannel} disabled={generalfielddisabled} />
                                    <ProgramSelect form={this.props.form} ref={(e) => { this.componentProgramSelect = e }} labeltext="Program" datafield="programcode" mode="multiple" disabled={generalfielddisabled} />
                                    <TierSelect form={this.props.form} ref={(e) => { this.componentTierSelect = e }} labeltext="Tier" datafield="tierid" mode="multiple" disabled={generalfielddisabled} />
                                    <SelectBase form={this.props.form} labeltext="Corporate Segment" onChange={this.onChangeSegment} datafield="corporatesegment" options={optionsSegment} validationrules={['required']} disabled={generalfielddisabled} />
                                    <CorporateSelect form={this.props.form} ref={(e) => { this.componentCorporateSelect = e }} labeltext="Corporate Code" mode="multiple" datafield="corporatecode" validationrules={(corporatesegment === 'SPECIFIC') ? ['required'] : []} disabled={corporatedisabled} corporateOptions={this.corporateOptions} />
                                    <AirlineSelect form={this.props.form} ref={(e) => { this.componentAirlineSelect = e }} labeltext="Airline" datafield="airlinecode" onChange={this.handleAirlineChange} disabled={generalfielddisabled} />
                                    <DateRangeBase form={this.props.form} labeltext="Date Of Issued" datafield="doi" placeholder={['Start Date Of Issued', 'End Date Of Issued']} disabled={generalfielddisabled} minDate={moment()} />
                                    <DateRangeBase form={this.props.form} labeltext="Date of Travel" datafield="dot" placeholder={['Start Date of Travel', 'End Date of Travel']} disabled={generalfielddisabled} minDate={moment()} />
                                    <SwitchButton form={this.props.form} labeltext="Eligible for Retro" onChange={this.handleIsEligibleForRetro} datafield="eligibleforretro" />
                                    <DateRangeBase form={this.props.form} labeltext="Retro Date" datafield="date" placeholder={['Retro Start Date', 'Retro End Date']} validationrules={(eligibleforretro) ? ['required'] : []} disabled={retrodatedissabled} minDate={moment()} />
                                    <Form.Item label="Route">
                                        <Button type="primary" size="default" label="Setup Route" htmlType="button" onClick={() => this.handleOpenRouteModal()} disabled={setuproutedisabled} />
                                    </Form.Item>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 16, offset: 4 }} xl={{ span: 16, offset: 4 }}>
                                    <SummaryRoute dataSource={routelist} handleRemoveRoute={this.handleRemoveRoute} />
                                </Col>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }} style={{ marginTop: '20px' }}>
                                    <Form.Item label="Subclass">
                                        <Button type="primary" size="default" label="Setup Subclass" htmlType="button" onClick={() => this.handleOpenSubclassModal()} disabled={setuproutedisabled} />
                                    </Form.Item>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 16, offset: 4 }} xl={{ span: 16, offset: 4 }}>
                                    <SummarySubclass dataSource={subclasslist} handleRemove={this.handleRemoveSubclass} />
                                </Col>
                            </Row>
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                {
                                    (actionspage === 'create') ?
                                        <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE"></Button>
                                        : (actionspage === 'update') ?
                                            <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE"></Button>
                                            : null
                                }
                                <Button url="/accrual-promo" htmlType="link" type="default" label="Back" />
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

class SummaryRoute extends Component {
    render() {
        let { dataSource } = this.props;
        dataSource = dataSource.map((obj, key) => { return ({ no: (key + 1), ...obj }) });
        return (
            <Table rowKey={record => record.number} dataSource={dataSource} pagination={false} scroll={{ y: 260 }}>
                <Column title="No" dataIndex="no" key="no" render={(value) => ((value) ? value : '-')} width="5%" />
                <Column title="Airline" dataIndex="airlinecode" key="airlinecode" render={(value) => ((value) ? value : '-')} width="20%" />
                <Column title="Flight Number" dataIndex="flightnumber" key="flightnumber" render={(value) => ((value) ? value : '-')} width="20%" />
                <Column title="Origin" dataIndex="origin" key="origin" render={(value) => ((value) ? value : '-')} width="20%" />
                <Column title="Destination" dataIndex="destination" key="destination" render={(value) => ((value) ? value : '-')} width="20%" />
                <Column
                    title="Action"
                    key="action"
                    render={(value, row) => (
                        <span>
                            <AntButton type="danger" size="small" icon="delete" onClick={(e) => this.props.handleRemoveRoute(e, row.flightscheduleid)} />
                        </span>
                    )}
                />
            </Table>
        )
    }
}

class SummarySubclass extends Component {
    render() {
        let { dataSource } = this.props;
        dataSource = dataSource.map((obj, key) => { return ({ no: (key + 1), ...obj }) });
        return (
            <Table rowKey={record => record.number} dataSource={dataSource} pagination={false} scroll={{ y: 260 }}>
                <Column title="No" dataIndex="no" key="no" render={(value) => ((value) ? value : '-')} width="5%" />
                <Column title="Airline" dataIndex="airlinecode" key="airlinecode" render={(value) => ((value) ? value : '-')} width="25%" />
                <Column title="Compartment Code" dataIndex="compartmentcode" key="compartmentcode" render={(value) => ((value) ? value : '-')} width="25%" />
                <Column title="Subclass Code" dataIndex="subclasscode" key="subclasscode" render={(value) => ((value) ? value : '-')} width="25%" />
                <Column
                    title="Action"
                    key="action"
                    render={(value, row) => (
                        <span>
                            <AntButton type="danger" size="small" icon="delete" onClick={(e) => this.props.handleRemove(e, row.compartmentcode, row.subclasscode)} />
                        </span>
                    )}
                />
            </Table>
        )
    }
}

const mapStateToProps = state => ({ ...state });
// export default connect(mapStateToProps)(Layout);
export default connect(mapStateToProps)(Form.create()(App));