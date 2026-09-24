import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RetrieveRequest, SaveRequest, DeleteRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import { Alert, Button, InputText } from '../../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin } from 'antd';

const prefixmenuname = 'PRMEMCR';
const menucode = 'PRMEMCR';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            actionspage: [],
            codecriteria: [],
            fielddisabled: {
                generalfielddisabled: false,
            }
        };
    };

    componentDidMount() {
        this.getDetail();
    };

    getDetail = async () => {
        const { type, promocode } = this.props;
        const url = api.url.promomanage.criteria.retrieve;
        let criteria = ['MIN_TIER', 'MIN_MILES', 'MAX_TIER', 'MAX_MILES'];
        let codecriteria = {};
        let actionspage = {};
        let setValue = {
            mintier: undefined,
            minmiles: undefined,
            maxtier: undefined,
            maxmiles: undefined
        };

        if (type === 'set_miles') {
            await criteria.map((obj, key) => {
                return RetrieveRequest(url, { criteriakey: obj, promocode, promocategorytype: 'MEMBER' }).then((response) => {
                    const { status, result } = response;
                    if (status.responsecode === '0000') {
                        if (result.length !== 0) {
                            codecriteria = { ...codecriteria, [obj]: result[0].criteriacode };
                            actionspage = { ...actionspage, [obj]: 'update' };
                            setValue = (obj === 'MIN_TIER') ? {
                                ...setValue, mintier: result[0].criteriavalue
                            } : (obj === 'MIN_MILES') ? {
                                ...setValue, minmiles: result[0].criteriavalue
                            } : (obj === 'MAX_TIER') ? {
                                ...setValue, maxtier: result[0].criteriavalue
                            } : {
                                ...setValue, maxmiles: result[0].criteriavalue
                            };
                        } else {
                            actionspage = { ...actionspage, [obj]: 'create' };
                            codecriteria = { ...codecriteria, [obj]: undefined };
                        }
                        this.setState({ actionspage, codecriteria })
                        this.props.form.setFieldsValue(setValue);
                    } else Alert.error(status.responsemessage)
                });
            });
            this.setState({ isLoading: false });
        } else {
            RetrieveRequest(url, { criteriakey: 'TIER_MILES', promocode, promocategorytype: 'AIR' }).then((response) => {
                const { status, result } = response;
                if (status.responsecode === '0000') {
                    if (result.length !== 0) {
                        let tiermiles_acc = result[0].criteriavalue;

                        let setValue = { tiermiles_acc };
                        this.props.form.setFieldsValue(setValue);
                        this.setState({ actionspage: 'update', criteriacode: result[0].criteriacode });
                    } else this.setState({ actionspage: 'create' });
                } else Alert.error(status.responsemessage)
                this.setState({ isLoading: false });
            });
        };
    };

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll(async (err, input) => {
            if (!err) {
                const { actionspage, criteriacode } = this.state || {};
                const { type, match } = this.props;
                const promocode = match.params.ID;
                this.setState({ isLoading: true });

                if (type === 'set_miles') {
                    await this.saveData(input);
                    await this.getDetail();
                } else {
                    if (actionspage === 'update') {
                        let url = api.url.promomanage.criteria.delete;
                        let data = { criteriacode };
                        var callback = (response) => {
                            const { responsecode, responsemessage } = response.status;
                            if (responsecode !== '0000') Alert.error(responsemessage);
                        };
                        await DeleteRequest(url, data, callback, null, null, true);
                    }

                    let data = {
                        promocode,
                        promocategorytype: 'AIR',
                        criteriakey: 'TIER_MILES',
                        criteriavaluelist: [input.tiermiles_acc]
                    };
                    await SaveRequest(api.url.promomanage.criteria.create, data).then((response) => {
                        const { responsecode, responsemessage } = response.status;
                        if (responsecode === '0000') {
                            Alert.success(responsemessage);
                        } else Alert.error(responsemessage);
                        this.setState({ isLoading: false });
                    })
                };
            }
        });
    };

    saveData = async (input) => {
        const { minmiles, mintier, maxtier, maxmiles } = input || {};
        const { actionspage, codecriteria } = this.state
        const { match } = this.props;

        const promocode = match.params.ID;
        const promocategorytype = 'MEMBER';

        const url = api.url.promomanage.criteria.create
        const message = 'New data has been created'

        let dataarray = { 'MIN_TIER': mintier, 'MIN_MILES': minmiles, 'MAX_TIER': maxtier, 'MAX_MILES': maxmiles };
        let criteriakey = ['MIN_TIER', 'MIN_MILES', 'MAX_TIER', 'MAX_MILES'];

        for (var key = 0; key < Object.keys(dataarray).length; key++) {
            if (actionspage[`${criteriakey[key]}`] === 'update' && codecriteria[`${criteriakey[key]}`]) {
                let url = api.url.promomanage.criteria.delete;
                let data = { criteriacode: codecriteria[`${criteriakey[key]}`] };
                var callback = (response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode !== '0000') Alert.error(responsemessage);
                };
                await DeleteRequest(url, data, callback, null, null, true);
            };
        };

        for (var key = 0; key < Object.keys(dataarray).length; key++) {
            let data = { promocode, promocategorytype, criteriakey: criteriakey[key], criteriavaluelist: [dataarray[`${criteriakey[key]}`]] };

            if (dataarray[`${criteriakey[key]}`]) {
                await SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode === '0000') {
                        Alert.success((responsemessage) ? responsemessage : message);
                    } else Alert.error(responsemessage);
                    this.setState({ isLoading: false });
                })
            }
        };
    };

    render() {
        const { type } = this.props;
        const { isLoading, fielddisabled } = this.state;
        const { generalfielddisabled } = fielddisabled;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 14 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 10 } }
        };

        return (
            <Row>
                <Spin spinning={isLoading}>
                    <Form {...formItemLayout} onSubmit={this.saveAction}>
                        <Row gutter={24}>
                            {(type === 'set_miles') ? <Col className='gutter-row' xs={24}>
                                <Row style={{ marginTop: 20, marginBottom: 20 }}>
                                    <Col xs={24} md={12}>
                                        <InputText form={this.props.form} labeltext='Minimum Current Balance' datafield='minmiles' validationrules={['pattern.number']} maxLength={16} disabled={generalfielddisabled} />
                                        <InputText form={this.props.form} labeltext='Minimum Current Tier Miles' datafield='mintier' validationrules={['pattern.number']} maxLength={16} disabled={generalfielddisabled} />
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <InputText form={this.props.form} labeltext='Maximum Current Balance' datafield='maxmiles' validationrules={['pattern.number']} maxLength={16} disabled={generalfielddisabled} />
                                        <InputText form={this.props.form} labeltext='Maximum Current Tier Miles' datafield='maxtier' validationrules={['pattern.number']} maxLength={16} disabled={generalfielddisabled} />
                                    </Col>
                                </Row>
                            </Col> : <Col className='gutter-row' xs={24} lg={{ span: 16 }}>
                                <InputText form={this.props.form} labeltext='Tier Miles Accumulation' datafield='tiermiles_acc' maxLength={255} disabled={generalfielddisabled} />
                            </Col>}
                        </Row>
                        <Row gutter={24} type='flex' justify='center' style={{ marginTop: 10 }}>
                            <Button htmlType='submit' type='default' label='Save' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='ACCESS'></Button>
                        </Row>
                    </Form>
                </Spin>
            </Row>
        );
    };
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));