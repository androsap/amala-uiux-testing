import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RetrieveRequest, SaveRequest, DeleteRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import { Alert, Button, DatePickerBase, InputText, SwitchButton } from '../../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin } from 'antd';
import moment from 'moment';

const prefixmenuname = 'PRMNACR';
const menucode = 'PRMNACR';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            actionspage: (this.props.type === 'activity_date') ? [] : 'create',
            criteriacode: (this.props.type === 'activity_date') ? [] : null,
            fielddisabled: {
                generalfielddisabled: false,
            }
        };
    };

    componentDidMount() {
        this.getDetail();
    };

    getDetail = () => {
        const { type, promocode } = this.props;
        const url = api.url.promomanage.criteria.retrieve;
        if (type === 'activity_date') {
            let criteria = ['START_ACTIVITY_DATE', 'END_ACTIVITY_DATE'];
            let actionspage = [];
            let criteriacode = [];

            criteria.map((obj, key) => {
                return RetrieveRequest(url, { criteriakey: obj, promocode, promocategorytype: 'NONAIR' }).then((response) => {
                    const { status, result } = response;
                    if (status.responsecode === '0000') {
                        if (result.length !== 0) {
                            let setValue = (key === 0) ? {
                                startactivitydate: (result[0].criteriavalue) ? moment(result[0].criteriavalue) : null
                            } : {
                                endactivitydate: (result[0].criteriavalue) ? moment(result[0].criteriavalue) : null
                            };

                            actionspage.push((result[0].criteriavalue) ? 'update' : 'create');
                            criteriacode.push((result[0].criteriavalue) ? result[0].criteriacode : null);

                            this.props.form.setFieldsValue(setValue);
                        } else {
                            actionspage.push('create');
                            criteriacode.push(null);
                        };
                    } else Alert.error(status.responsemessage);
                    this.setState({ actionspage, criteriacode, isLoading: false });
                });
            });
        } else {
            const criteriakey = (type === 'minimum_transfer_point') ? 'MINIMUM_MILES' : (type === 'total_miles_accumulation') ? 'TOTAL_MILES' : (type === 'accumulation_per_month') ? 'ACCUMULATION_PER_MONTH' : (type === 'max_process') ? 'MAX_PROCESS' : 'MINIMUM_TRX';

            RetrieveRequest(url, { criteriakey, promocode, promocategorytype: 'NONAIR' }).then((response) => {
                const { status, result } = response;
                if (status.responsecode === '0000') {
                    if (result.length !== 0) {
                        let accumulationpermonth = (result[0].criteriavalue !== undefined) ? ((result[0].criteriavalue === 'TRUE') ? true : false) : null;
                        let mintransferpoint = (result[0].criteriavalue !== undefined) ? result[0].criteriavalue : null;
                        let totalmiles = (result[0].criteriavalue !== undefined) ? result[0].criteriavalue : null;
                        let mintrx = (result[0].criteriavalue !== undefined) ? result[0].criteriavalue : null;
                        let maxprocess = (result[0].criteriavalue && result[0].criteriavalue !== 'Invalid date') ? moment(result[0].criteriavalue) : null;

                        let setValue = (type === 'minimum_transfer_point') ? { mintransferpoint } : (type === 'total_miles_accumulation') ? { totalmiles } : (type === 'accumulation_per_month') ? { accumulationpermonth } : (type === 'max_process') ? { maxprocess } : { mintrx };

                        this.setState({ actionspage: 'update', criteriacode: result[0].criteriacode });
                        this.props.form.setFieldsValue(setValue);
                    } else this.setState({ actionspage: 'create' });
                } else Alert.error(status.responsemessage);
                this.setState({ isLoading: false });
            });
        };
    };

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                const { startactivitydate, endactivitydate, mintransferpoint, totalmiles, mintrx, accumulationpermonth, maxprocess } = input || {};
                const { type, match } = this.props;
                const { actionspage, criteriacode } = this.state;

                const promocode = match.params.ID;
                const promocategorytype = 'NONAIR';

                const url = api.url.promomanage.criteria.create;
                const message = 'New data has been created';

                var callback = null;

                if (type === 'activity_date') {
                    let dataarray = [startactivitydate, endactivitydate];

                    for (var i = 0; i < actionspage.length; i++) {
                        if (actionspage[i] === 'update') {
                            let url = api.url.promomanage.criteria.delete;
                            let data = { criteriacode: criteriacode[i] };
                            callback = (response) => {
                                const { responsecode, responsemessage } = response.status;
                                if (responsecode !== '0000') {
                                    Alert.error(responsemessage);
                                } else Alert.success(responsemessage);
                            };
                            DeleteRequest(url, data, callback, null, null, true);
                        }
                    };
                    setTimeout(() => {
                        for (var key = 0; key < dataarray.length; key++) {
                            let criteriakey = (key === 0) ? 'START_ACTIVITY_DATE' : 'END_ACTIVITY_DATE';
                            let data = {
                                promocode, promocategorytype, criteriakey,
                                criteriavaluelist: (dataarray[key]) ? [moment(dataarray[key]).format('YYYY-MM-DD')] : null
                            };
                            if (dataarray[key]) {
                                SaveRequest(url, data).then((response) => {
                                    const { responsecode, responsemessage } = response.status;
                                    if (responsecode === '0000') {
                                        Alert.success((responsemessage) ? responsemessage : message);
                                        setTimeout(() => {
                                            this.getDetail();
                                            this.setState({ isLoading: false });
                                        }, 500);
                                    } else Alert.error(responsemessage);
                                })
                            } else setTimeout(() => {
                                this.getDetail();
                                this.setState({ isLoading: false });
                            }, 500);
                        };
                    }, 500);
                } else {
                    let criteriakey = (type === 'minimum_transfer_point') ? 'MINIMUM_MILES' : (type === 'total_miles_accumulation') ? 'TOTAL_MILES' : (type === 'accumulation_per_month') ? 'ACCUMULATION_PER_MONTH' : (type === 'max_process') ? 'MAX_PROCESS' : 'MINIMUM_TRX';
                    let criteriavaluelist = [(type === 'accumulation_per_month') ? ((accumulationpermonth) ? 'TRUE' : 'FALSE') : (type === 'minimum_transfer_point') ? mintransferpoint :
                        (type === 'total_miles_accumulation') ? totalmiles : (type === 'max_process') ? (maxprocess && maxprocess !== 'Invalid date') ? moment(maxprocess).format('YYYY-MM-DD') : null : mintrx];
                    let data = { promocode, promocategorytype, criteriakey, criteriavaluelist };

                    if (actionspage === 'update') {
                        let url = api.url.promomanage.criteria.delete;
                        let data = { criteriacode };
                        callback = (response) => {
                            const { responsecode, responsemessage } = response.status;
                            if (responsecode !== '0000') Alert.error(responsemessage);
                        };

                        DeleteRequest(url, data, callback, null, null, true);
                    };

                    setTimeout(() => {
                        if (criteriavaluelist.length !== 0 && criteriavaluelist[0] !== null) {
                            SaveRequest(url, data).then((response) => {
                                const { responsecode, responsemessage } = response.status;
                                if (responsecode === '0000') {
                                    Alert.success((responsemessage) ? responsemessage : message);
                                    setTimeout(() => {
                                        this.getDetail();
                                        this.setState({ isLoading: false });
                                    }, 500);
                                } else Alert.error(responsemessage);
                            })
                        } else {
                            if (actionspage === 'update') Alert.success('data.success.delete');
                            setTimeout(() => {
                                this.setState({ isLoading: false });
                                this.getDetail();
                            }, 500);
                        };
                    }, 500);
                };
            };
        });
    };

    render() {
        const { type } = this.props;
        const { isLoading } = this.state;
        const { generalfielddisabled } = this.state.fielddisabled;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 14 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 10 } }
        };

        return (
            <Row>
                <Spin spinning={isLoading}>
                    <Form {...formItemLayout} onSubmit={this.saveAction}>
                        <Row gutter={24}>
                            {(type === 'activity_date') ? <Col className='gutter-row' xs={24} lg={{ span: 16 }}>
                                <DatePickerBase form={this.props.form} labeltext='Start Activity Date' datafield='startactivitydate' validationrules={null} minDate={moment()} disabled={generalfielddisabled} />
                                <DatePickerBase form={this.props.form} labeltext='End Activity Date' datafield='endactivitydate' validationrules={null} minDate={moment()} disabled={generalfielddisabled} />
                            </Col> : (type === 'max_process') ? <Col className='gutter-row' xs={24} lg={{ span: 16 }}>
                                <DatePickerBase form={this.props.form} labeltext='Max Process' datafield='maxprocess' minDate={moment()} disabled={generalfielddisabled} />
                            </Col> : (type === 'minimum_transfer_point') ? <Col className='gutter-row' xs={24} lg={{ span: 16 }}>
                                <InputText form={this.props.form} labeltext='Minimum Transfer Point' datafield='mintransferpoint' validationrules={['pattern.number']} maxLength={16} disabled={generalfielddisabled} />
                            </Col> : (type === 'total_miles_accumulation') ? <Col className='gutter-row' xs={24} lg={{ span: 16 }}>
                                <InputText form={this.props.form} labeltext='Total Miles Accumulation' datafield='totalmiles' validationrules={['pattern.number']} maxLength={16} disabled={generalfielddisabled} />
                            </Col> : (type === 'accumulation_per_month') ? <Col className='gutter-row' xs={24} lg={{ span: 16 }}>
                                <SwitchButton form={this.props.form} labeltext='Accumulation Per Month' datafield='accumulationpermonth' disabled={generalfielddisabled} />
                            </Col> : <Col className='gutter-row' xs={24} lg={{ span: 16 }}>
                                <InputText form={this.props.form} labeltext='Minimum Transaction' datafield='mintrx' validationrules={['pattern.number']} maxLength={16} disabled={generalfielddisabled} />
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
};

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));