
import React, { Component } from 'react';
import { api } from '../../../../config/Services';
import { connect } from 'react-redux';
import { SaveRequest, DetailRequest, RetrieveRequest } from '../../../../utilities/RequestService';
import { Alert, Button, ErrorGeneral, InputText, DateRangeBase, TextArea, RadioButton, SwitchButton, InputNumber } from '../../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin, Modal, Typography } from 'antd';
import { PromoType, ValueType } from '../../../../data';
import moment from 'moment';

import RegistrationCodeSetupCreate from './registration_code_setup/IndexCreate';
import RegistrationCodeSetupUpdate from './registration_code_setup/IndexUpdate';
import RegistrationCodeSetupForm from './registration_code_setup/Form';

const { Text } = Typography;
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            titlepage: 'Create',
            actionspage: 'create',
            actionspageregis: 'create',
            formrender: true,
            showregis: false,
            regcode: null,
            regdata: [],
            regisList: [],
            promocode: null,
            fielddisabled: {
                generalfielddisabled: false,
                specialfielddisabled: false
            }
        }
    };

    checkPermission() {
        let id = this.props.match.params.ID;
        const { menucode, permission, prefixmenuname } = this.props;
        const { usermenu } = permission;
        if (id) {
            let titlepage = 'Edit';
            let actionspage = 'update';
            let generalfielddisabled = false;
            let specialfielddisabled = true;

            if (!usermenu[menucode][prefixmenuname + '_UPDATE']) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
            }
            let fielddisabled = { generalfielddisabled, specialfielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled, promocode: id });
            this.getDetail();
            this.getUsage();
        } else {
            if (!usermenu[menucode][prefixmenuname + '_CREATE']) {
                this.setState({ responseMessage: `Sorry, your role can't perform this action`, formrender: false });
            } else this.props.form.setFieldsValue({ needregister: false });
        };
    };

    componentDidMount() {
        this.checkPermission();
    };

    getDetail = async () => {
        await this.setState({ isLoading: true });
        const { datapromo } = this.props;
        const { promocode, name, description, promotype, bonusaward, bonusawardtype, bonustier, bonustiertype, bonusfreq, bonusfreqtype, totalparticipant,
            limitpermember, limittotalmiles, startdate, enddate, needregister, status, maxbonusaward, maxbonusfreq, maxbonustier } = (datapromo) ? datapromo[0] : {};

        const promoperiod = (startdate && enddate) ? [moment(startdate), moment(enddate)] : [];
        const setValue = {
            promocode, name, description, promotype, bonusaward, bonusawardtype, bonustier, bonustiertype, bonusfreq, bonusfreqtype,
            totalparticipant, limitpermember, limittotalmiles, promoperiod, needregister, maxbonusaward, maxbonusfreq, maxbonustier,
            statuspromo: status
        };

        let regisList = [];
        await RetrieveRequest(api.url.promomanage.regcode.retrieve, { promocode }).then((response) => {
            const { status, result } = response;
            const { responsecode, responsemessage } = status;
            if (responsecode === '0000' && result) {
                regisList = result;
            } else Alert.error(responsemessage);
        });

        await this.props.form.setFieldsValue(setValue);
        await this.setState({ regisList, promocode, isLoading: false });
    };

    saveAction = (e) => {
        e.preventDefault();
        const { actionspage, regisList } = this.state;

        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                const { datapromo } = this.props;
                const { promocode, name, description, promotype, bonusaward, bonusawardtype, bonustier, bonustiertype, bonusfreq, bonusfreqtype, totalparticipant,
                    limitpermember, limittotalmiles, promoperiod, needregister, statuspromo, maxbonusaward, maxbonusfreq, maxbonustier } = input || {};
                const startdate = (promoperiod) ? moment(promoperiod[0]).format('YYYY-MM-DD') : null;
                const enddate = (promoperiod) ? moment(promoperiod[1]).format('YYYY-MM-DD') : null;

                let data = {
                    promocode, name, description, promotype, bonusawardtype, bonustiertype, bonusfreqtype, startdate, enddate, needregister, maxbonusaward, maxbonusfreq, maxbonustier,
                    status: statuspromo,
                    bonusfreq: (bonusfreq) ? Number(bonusfreq) : 0,
                    bonusaward: (bonusaward) ? Number(bonusaward) : 0,
                    bonustier: (bonustier) ? Number(bonustier) : 0,
                    totalparticipant: (totalparticipant) ? Number(totalparticipant) : null,
                    limitpermember: (limitpermember) ? Number(limitpermember) : null,
                    limittotalmiles: (limittotalmiles) ? Number(limittotalmiles) : null,
                };

                if (actionspage === 'create') {
                    data.status = 'INACTIVE'
                } else data = { ...datapromo[0], ...data };

                let url = (actionspage === 'create') ? api.url.promomanage.create : api.url.promomanage.update;
                let message = (actionspage === 'create') ? 'New data has been created' : 'Data has been updated';

                if (actionspage === 'create' && needregister) {
                    if (regisList.length !== 0) {
                        SaveRequest(url, data).then((response) => {
                            const { result, status } = response
                            const { responsecode, responsemessage } = status;
                            if (responsecode === '0000' && result) {
                                const { promocode } = result;
                                Alert.success((responsemessage) ? responsemessage : message);
                                setTimeout(() => {
                                    regisList.map((obj) => {
                                        return {
                                            promocode,
                                            channel: obj.channel,
                                            startdate: obj.startdate,
                                            enddate: obj.enddate,
                                            registrationcode: obj.registrationcode,
                                            status: obj.status
                                        }
                                    }).map((obj) => {
                                        SaveRequest(api.url.promomanage.regcode.create, obj).then((response) => {
                                            const { responsecode, responsemessage } = response.status;
                                            if (responsecode === '0000') {
                                                this.props.history.push('/promo-manage-catalog');
                                            } else Alert.error(responsemessage);
                                        })
                                    });
                                }, 1000);
                            } else Alert.error(responsemessage);
                        })
                    } else Alert.error('Please setup registration code first');
                    this.setState({ isLoading: false });
                } else {
                    if (actionspage === 'update' && needregister && regisList.length === 0) {
                        Alert.error('Please setup registration code first');
                        this.setState({ isLoading: false });
                    } else SaveRequest(url, data).then((response) => {
                        const { result, status } = response
                        const { responsecode, responsemessage } = status;
                        if (responsecode === '0000' && result) {
                            Alert.success((responsemessage) ? responsemessage : message);
                            this.props.history.push('/promo-manage-catalog');
                        } else Alert.error(responsemessage);
                        this.setState({ isLoading: false });
                    });
                };
            };
        });
    };

    handlePromoCode = (val, fromSave) => {
        const promocode = (fromSave) ? this.state.promocode : this.props.form.getFieldValue('promocode');
        this.props.form.setFieldsValue({ promocode });
        this.setState({ promocode });
    };

    handleRegistrationModal = (value, type) => {
        const { actionspage, promocode } = this.state;
        if (actionspage === 'create') {
            this.setState({ showregis: true, actionspageregis: 'create' });
        } else this.componentRegistrationCode.handleModal(value, type);
        this.props.form.setFieldsValue({ promocode });
    };

    handleSaveRegis = async (actionsregispage, value) => {
        let { actionspage, regisList, regcode, promocode } = this.state;
        this.props.form.setFieldsValue({ promocode });

        if (actionspage === 'create') {
            if (actionsregispage === 'create') {
                regisList.push(value);
                this.setState({ regisList, showregis: false });

            } else if (actionsregispage === 'update') {
                regisList = regisList.map((obj, key) => {
                    if (obj.registrationcode === regcode) { obj = value }
                    return obj;
                });
                this.setState({ regisList, showregis: false });
            }
        }
    };

    handleEditRegis = (regcode) => {
        this.setState({ regcode, showregis: true, actionspageregis: 'update' });
        this.props.form.setFieldsValue({ promocode: this.state.promocode });
    };

    handleDeleteRegis = (regcode) => {
        let { regisList } = this.state;
        regisList = regisList.filter(obj => obj.registrationcode !== regcode);
        this.setState({ regisList });
    };

    handleRefresh = () => {
        this.checkPermission();
    };

    handleClose = async () => {
        await this.setState({ showregis: false });
        await this.props.form.setFieldsValue({ promocode: this.state.promocode });
    };

    getUsage = async () => {
        await this.setState({ isLoading: true });
        const { datapromo } = this.props;
        const { promocode } = (datapromo) ? datapromo[0] : {}
        DetailRequest(api.url.promomanage.usage, { promocode }).then((response) => {
            let { status = {}, result } = response;
            if (result && status.responsecode === '0000') {
                if (result.length !== 0) {
                    let awardmilesused = (result.awardmilesused) ? result.awardmilesused : 0;
                    let participantused = (result.participantused) ? result.participantused : 0;

                    this.setState({ awardmilesused, participantused });
                }
                this.setState({ result: result[0] });
            }
        })
    };

    handleNeedRegister = (val) => {
        const { actionspage } = this.state;
        if (actionspage === 'update' && val) {
            this.getRegCodeDetail();
        } else this.setState({ regisList: [] });
    };

    getRegCodeDetail = () => {
        const { promocode } = this.state;
        RetrieveRequest(api.url.promomanage.regcode.retrieve, { promocode }).then((response) => {
            const { status, result } = response;
            if (status.responsecode === '0000' && result) {
                this.setState({ regisList: result });
            } else Alert.error(status.responseMessage);
        });
    };

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, actionspage, actionspageregis, formrender, fielddisabled, showregis, isLoading, regcode, regisList, awardmilesused, participantused } = this.state;
        const { generalfielddisabled, specialfielddisabled } = fielddisabled;
        const { menucode, prefixmenuname, datapromo } = this.props;
        const titleModal = `${(actionspageregis === 'create') ? 'Add' : 'Edit'} Registration Code`;

        const needregister = this.props.form.getFieldValue('needregister');
        const suffixAward = (this.props.form.getFieldValue('bonusawardtype') === 'PERCENTAGE') ? '%' : 'Miles';
        const suffixTier = (this.props.form.getFieldValue('bonustiertype') === 'PERCENTAGE') ? '%' : 'Miles';
        const suffixFreq = (this.props.form.getFieldValue('bonusfreqtype') === 'PERCENTAGE') ? '%' : 'Miles';

        if (formrender) {
            document.title = `${titlepage} Promo Management | Loyalty Management System`;
            return (
                <Row>
                    <Modal centered visible={showregis} title={titleModal} onCancel={this.handleClose} footer={null} destroyOnClose={true} width={700}>
                        <RegistrationCodeSetupForm {...this.props} datapromo={datapromo} onClose={this.handleClose} regcode={regcode} regdata={regisList} handlePromoCode={this.handlePromoCode}
                            actionspageregis={actionspageregis} actionspagemaster={actionspage} handleSaveRegis={this.handleSaveRegis} handleRefresh={this.handleRefresh} />
                    </Modal>

                    <Spin spinning={isLoading}>
                        <Form {...formItemLayout}>
                            <Row gutter={24}>
                                <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <InputText form={this.props.form} labeltext='Promo Code' datafield='promocode' maxLength={45} validationrules={['required', 'pattern.alphabetnumeric']} disabled={specialfielddisabled} onBlur={this.handlePromoCode} />
                                    <InputText form={this.props.form} labeltext='Promo Name' datafield='name' maxLength={100} validationrules={['required']} disabled={generalfielddisabled} />
                                    <TextArea form={this.props.form} labeltext='Description' datafield='description' disabled={generalfielddisabled} maxLength={255} />
                                    <RadioButton form={this.props.form} labeltext='Promo Type' datafield='promotype' options={PromoType} validationrules={['required']} disabled={generalfielddisabled} />
                                    <RadioButton form={this.props.form} labeltext='Bonus Award Type' datafield='bonusawardtype' options={ValueType} validationrules={['required']} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext='Bonus Award' datafield='bonusaward' suffix={suffixAward} maxLength={10} validationrules={(suffixAward === '%') ? ['required', 'pattern.numberdot'] : ['required', 'pattern.number']} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext='Max Bonus Award' className={(suffixAward === '%') ? '' : 'hidden'} datafield='maxbonusaward' maxLength={10} validationrules={(suffixAward === '%') ? ['pattern.numberdot'] : ['pattern.number']} disabled={generalfielddisabled} />
                                    <RadioButton form={this.props.form} labeltext='Bonus Tier Type' datafield='bonustiertype' options={ValueType} validationrules={['required']} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext='Bonus Tier' datafield='bonustier' suffix={suffixTier} maxLength={10} validationrules={(suffixTier === '%') ? ['required', 'pattern.numberdot'] : ['required', 'pattern.number']} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext='Max Bonus Tier' className={(suffixTier === '%') ? '' : 'hidden'} datafield='maxbonustier' maxLength={10} validationrules={(suffixTier === '%') ? ['pattern.numberdot'] : ['pattern.number']} disabled={generalfielddisabled} />
                                    <RadioButton form={this.props.form} labeltext='Bonus Frequency Type' datafield='bonusfreqtype' options={ValueType} validationrules={['required']} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext='Bonus Frequency' datafield='bonusfreq' suffix={suffixFreq} maxLength={10} validationrules={(suffixFreq === '%') ? ['required', 'pattern.numberdot'] : ['required', 'pattern.number']} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext='Max Bonus Frequency' className={(suffixFreq === '%') ? '' : 'hidden'} datafield='maxbonusfreq' maxLength={10} validationrules={(suffixFreq === '%') ? ['pattern.numberdot'] : ['pattern.number']} disabled={generalfielddisabled} />
                                    <Row>
                                        <Col xs={15}>
                                            <InputNumber labelCol={{ span: 13 }} wrapperCol={{ span: 11 }} form={this.props.form} labeltext='Total Participant' datafield='totalparticipant' maxLength={10} validationrules={['pattern.number']} disabled={generalfielddisabled} min={0} />
                                        </Col>
                                        {(actionspage !== 'create') ? <Col xs={9} sm={{ push: 0.5 }}>
                                            <Text labelCol={{ span: 14 }} wrapperCol={{ span: 14 }} style={{ display: 'block', marginLeft: 10, }}>
                                                {
                                                    `Promo Usage: ${participantused === undefined ? '0' : participantused} participant`
                                                }
                                            </Text>
                                        </Col> : null}
                                    </Row>
                                    <Row>
                                        <Col xs={15}>
                                            <InputNumber labelCol={{ span: 13 }} wrapperCol={{ span: 11 }} form={this.props.form} labeltext='Limit per Member' datafield='limitpermember' maxLength={10} validationrules={['pattern.number']} disabled={generalfielddisabled} min={0} />
                                        </Col>
                                    </Row>
                                    <Row >
                                        <Col xs={15}>
                                            <InputText labelCol={{ span: 13 }} wrapperCol={{ span: 11 }} form={this.props.form} labeltext='Limit Total Award Miles' datafield='limittotalmiles' suffix='Miles' maxLength={10} validationrules={['pattern.number']} disabled={generalfielddisabled} />
                                        </Col>
                                        {(actionspage !== 'create') ? <Col xs={9} sm={{ push: 0 }}>
                                            <Text labelCol={{ span: 14 }} wrapperCol={{ span: 14 }} style={{ display: 'block', marginLeft: 10, }}>
                                                {
                                                    `Promo Usage: ${awardmilesused === undefined ? '0' : awardmilesused} miles`
                                                }
                                            </Text>
                                        </Col> : null}
                                    </Row>
                                    <DateRangeBase form={this.props.form} labeltext='Promo Period' datafield='promoperiod' placeholder={['Start Promo Date', 'End Promo Date']} validationrules={['required']} disabled={generalfielddisabled} minDate={moment()} />
                                    {(actionspage !== 'create') ? <InputText form={this.props.form} labeltext='Status' datafield='statuspromo' disabled={specialfielddisabled} /> : null}
                                    <Row>
                                        <Col xs={14}>
                                            <SwitchButton labelCol={{ span: 14 }} wrapperCol={{ span: 10 }} form={this.props.form} labeltext='Need Registration' datafield='needregister' onChange={this.handleNeedRegister} />
                                        </Col>
                                        <Col xs={10} style={{ marginTop: 5, marginLeft: -10 }}>
                                            {(needregister) ? <Button type='primary' htmlType='button' size='default' label='+ Add New Registration Code' onClick={() => this.handleRegistrationModal(true, 'registration')} /> : null}
                                        </Col>
                                    </Row>
                                </Col>
                                <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 22, offset: 1 }} style={{ marginTop: 10 }}>
                                    {
                                        (needregister) ? (actionspage === 'create') ?
                                            <RegistrationCodeSetupCreate {...this.props} datasource={regisList} handleRefresh={this.handleRefresh} handleEditRegis={this.handleEditRegis} handleDeleteRegis={this.handleDeleteRegis} /> :
                                            <RegistrationCodeSetupUpdate {...this.props} ref={(e) => { this.componentRegistrationCode = e }} datapromo={datapromo} actionspageregis={actionspageregis} handlePromoCode={this.handlePromoCode} getRegCodeDetail={this.getRegCodeDetail} /> : null
                                    }
                                </Col>
                            </Row>
                            <Row gutter={24} type='flex' justify='center' style={{ marginTop: 30 }}>
                                {
                                    ((actionspage === 'create') || (actionspage === 'update')) ?
                                        <Button htmlType='button' type='primary' label='Save' menucode={menucode} prefixmenuname={prefixmenuname} actioncode={(actionspage === 'create') ? 'CREATE' : 'UPDATE'} onClick={this.saveAction}></Button>
                                        : null
                                }
                                <Button url='/promo-manage-catalog' htmlType='link' type='default' label='Back' />
                            </Row>
                        </Form>
                    </Spin>
                </Row>
            )
        } else return (<ErrorGeneral {...this.props} message={this.state.responseMessage} />);
    };
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));