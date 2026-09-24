import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RetrieveRequest, SaveRequest, DeleteRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import { Alert, Button, DateRangeBase, SwitchButton } from '../../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin } from 'antd';

import moment from 'moment';

const prefixmenuname = 'PRMACR';
const menucode = 'PRMACR';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            actionspage: (this.props.type === 'ticket_issueddate' || this.props.type === 'date_of_travel' || this.props.type === 'retro') ? [] : 'create',
            criteriacode: (this.props.type === 'ticket_issueddate' || this.props.type === 'date_of_travel' || this.props.type === 'retro') ? [] : null,
            fielddisabled: {
                generalfielddisabled: false,
                retrodatedissabled: true,
            },
            isEligibleForRetro: false,
            eligibleForRetroValue: null,
        };
    };

    componentDidMount() {
        this.getDetail();
    };

    getDetail = () => {
        const { type, promocode } = this.props;
        const url = api.url.promomanage.criteria.retrieve;

        let actionspage = [];
        let criteriacode = [];
        let isEligibleForRetro = false;
        let validationRetro = null;
        let criteria = (type === 'ticket_issueddate') ? ['START_TICKET_ISSUED_DATE', 'END_TICKET_ISSUED_DATE'] :
            (type === 'retro') ? ['START_RETRO_DATE', 'END_RETRO_DATE' , 'ELIGIBLE_FOR_RETRO'] : ['START_DOT_DATE', 'END_DOT_DATE'];

        Promise.all(criteria.map(obj => 
            RetrieveRequest(url, { criteriakey: obj, promocode, promocategorytype: 'AIR' })
        )).then(responses => {
            let values = {};
            responses.forEach((response, index) => {
                const { status, result } = response;
                if (status.responsecode === '0000' && result.length !== 0) {
                    let key = criteria[index].toLowerCase().replace(/_/g, '');
                    values[key] = moment(result[0].criteriavalue);
                    actionspage.push('update');
                    criteriacode.push(result[0].criteriacode);
                    if (type === 'retro' && key === 'eligibleforretro') {
                        isEligibleForRetro = result[0].criteriavalue === 'Yes';
                        validationRetro = isEligibleForRetro ? ['required'] : null;
                    }
                } else {
                    actionspage.push('create');
                    criteriacode.push(null);
                }
            });

            if (Object.keys(values).length > 0) {
                let daterangeField;
                if (type === 'ticket_issueddate') {
                    daterangeField = 'ticketissueddaterange';
                    this.props.form.setFieldsValue({
                        [daterangeField]: [values.startticketissueddate, values.endticketissueddate].filter(Boolean),
                    });
                } else if (type === 'retro') {
                    daterangeField = 'retroranger';
                    this.props.form.setFieldsValue({
                        [daterangeField]: [values.startretrodate, values.endretrodate].filter(Boolean),
                    });
                } else if (type === 'date_of_travel') {
                    daterangeField = 'dotdaterange';
                    this.props.form.setFieldsValue({
                        [daterangeField]: [values.startdotdate, values.enddotdate].filter(Boolean),
                    });
                }
            }
            this.setState({ actionspage, criteriacode, isLoading: false, isEligibleForRetro, validationRetro, eligibleForRetroValue: isEligibleForRetro ? 'Yes' : null, fielddisabled: {
                ...this.state.fielddisabled,
                retrodatedissabled: !isEligibleForRetro
            } });
        });
    };

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                const { ticketissueddaterange, dotdaterange, retroranger } = input || {};
                const { type, match } = this.props;
                const { actionspage, criteriacode, eligibleForRetroValue } = this.state;

                const promocode = match.params.ID;
                const promocategorytype = 'AIR';

                const url = api.url.promomanage.criteria.create;
                const message = 'New data has been created';

                var callback = null;

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
                    setTimeout(() => {
                        this.getDetail();
                        this.setState({ isLoading: false });
                    }, 500);    
                };

                let dataarray = (type === 'ticket_issueddate') ? ticketissueddaterange : (type === 'retro') ? retroranger : dotdaterange;
                setTimeout(() => {
                    if (!dataarray || dataarray.length === 0) {
                        this.setState({ isLoading: false });
                        return;
                    }
                    for (var key = 0; key < dataarray.length; key++) {
                        let criteriakey = (type === 'date_of_travel') ? ((key === 0) ? 'START_DOT_DATE' : 'END_DOT_DATE') :
                            (type === 'retro') ? ((key === 0) ? 'START_RETRO_DATE' : 'END_RETRO_DATE') :
                                ((key === 0) ? 'START_TICKET_ISSUED_DATE' : 'END_TICKET_ISSUED_DATE');

                        let data = { promocode, promocategorytype, criteriakey, criteriavaluelist: [moment(dataarray[key]).format('YYYY-MM-DD')] };
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
                        } else {
                            setTimeout(() => {
                                this.getDetail();
                                this.setState({ isLoading: false });
                            }, 500);
                        }
                    };
                    if (type === 'retro'){
                        let data = {promocode, promocategorytype, criteriakey: 'ELIGIBLE_FOR_RETRO', criteriavaluelist: [eligibleForRetroValue] };

                        if (eligibleForRetroValue == null) {
                            return;
                        }

                        SaveRequest(url, data).then((response) => {
                            const { responsecode, responsemessage } = response.status;
                            if (responsecode === '0000') {
                                Alert.success((responsemessage) ? responsemessage : message);
                            } else {
                                Alert.error(responsemessage);
                            }
                        });
                    }
                }, 500);
            };
        });
    };

    handleIsEligibleForRetro = (isEligibleForRetro) => {
        const value = isEligibleForRetro ? 'Yes' : null;
        this.setState({ 
            eligibleForRetroValue: value,
            fielddisabled: { 
                ...this.state.fielddisabled, 
                retrodatedissabled: !isEligibleForRetro 
            },
            validationRetro: isEligibleForRetro ? ['required'] : null
        });
        if (!isEligibleForRetro) {
            this.props.form.setFieldsValue({ retroranger: [null, null] });
        }
    }

    render() {
        const { type } = this.props;
        const { isLoading, isEligibleForRetro, fielddisabled, validationRetro } = this.state;
        const { generalfielddisabled, retrodatedissabled } = fielddisabled;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 14 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 10 } }
        };

        const datelabel = `${(type === 'ticket_issueddate') ? 'Issued Date' : (type === 'retro') ? 'Retro Date' : 'Activity Date'}`;
        const datedatafield = (type === 'ticket_issueddate') ? 'ticketissueddaterange' : (type === 'retro') ? 'retroranger' : 'dotdaterange';

        return (
            <Row>
                <Spin spinning={isLoading}>
                    <Form {...formItemLayout} onSubmit={this.saveAction}>
                        <Row gutter={24}>
                        {type === 'retro' && (
                            <Col className='gutter-row' xs={24} lg={{ span: 16 }}>
                                <SwitchButton form={this.props.form} labeltext="Eligible for Retro" onChange={this.handleIsEligibleForRetro} datafield="eligibleforretro" defaultChecked={isEligibleForRetro} />
                            </Col>
                        )}
                            <Col className='gutter-row' xs={24} lg={{ span: 16 }}>
                                <DateRangeBase form={this.props.form} labeltext={datelabel} datafield={datedatafield} validationrules={validationRetro} minDate={moment()} disabled={type === 'retro' ? retrodatedissabled : generalfielddisabled}  />
                            </Col>
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
