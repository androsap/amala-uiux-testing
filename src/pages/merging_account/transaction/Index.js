
import React from 'react';
import { api } from '../../../config/Services'
import { SaveRequest, DetailRequest } from '../../../utilities/RequestService';
import { TableBase, Alert, TextArea, DatePickerBase, SelectBase } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Modal, Spin, Card, Button, Icon } from 'antd';
import { jsUcfirst } from '../../../utilities/Helpers';
import moment from 'moment';

const { confirm } = Modal;

const optionsChannel = [
    { value: 'EMAIL', label: 'Email' },
    { value: 'WHATSAPP', label: 'WhatsApp' },
    { value: 'PHONE', label: 'Phone' },
    { value: 'PARTNER', label: 'Partner' },
    { value: 'CALLCENTER', label: 'Call Center' },
    { value: 'BO', label: 'BO' },
    { value: 'OTHER', label: 'Other' }
];

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            membercardOri: [],
            membercardDes: [],
        }
    }

    componentDidMount() {
        document.title = 'Merge Member | Loyalty Management System';
        this.getCardnumber();
    };

    getCardnumber = () => {
        const { memberidOri, memberidDes } = this.props;
        let url = api.url.member.profile;
        this.setState({ isLoading: true });
        DetailRequest(url, { memberid: memberidOri, type: 'SUMMARY' }).then((response) => {
            const { status = {}, result } = response || {};
            if (status.responsecode === '0000') {
                if (response.result.status !== 'MERGED') {
                    this.setState({ membercardOri: [result] });
                } else {
                    Alert.error('This member origin already merged');
                    this.props.onClose();
                }
            }
        });
        DetailRequest(url, { memberid: memberidDes, type: 'SUMMARY' }).then((response) => {
            const { status = {}, result } = response || {};
            if (status.responsecode === '0000') {
                if (response.result.status !== 'MERGED') {
                    this.setState({ membercardDes: [result], isLoading: false });
                } else {
                    Alert.error('This member destination already merged');
                    this.props.onClose();
                }
            }
        });
    };

    handleMenuCallback = () => {
        this.props.handleMenuCallback({ choosen: 'retro-claim', current: 3 });
    };

    handleOpenModal = () => {
        const mergingAccount = () => { this.getMergingAccount(); }
        confirm({
            title: 'Are you sure merge this member?',
            onOk() { mergingAccount(); },
            onCancel() { },
        });
    };

    getMergingAccount = () => {
        this.setState({ isLoading: true });
        const { membercardOri, membercardDes } = this.state;
        const { memberidOri, memberidDes } = this.props;

        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ loading: true });
                let requestnotes1 = input.requestnotes1;
                let requestnotes2 = input.requestnotes2;
                let requestnotes3 = moment(input.requestnotes3).format('DD/MM/YYYY');
                let detailofrequest = input.detailofrequest;
                let status = 'REQUESTED'

                let data = { status, requestnotes: requestnotes1 + '#' + requestnotes2 + '#' + requestnotes3, detailofrequest, mastermember: membercardOri[0].memberid, mergewith: membercardDes[0].memberid }
                let url = api.url.profileintegration.merge;

                SaveRequest(url, data).then((response) => {
                    const { status = {}, result } = response || {};
                    if (status.responsecode === '0000') {
                        Alert.success(status.responsemessage);
                        this.props.history.push({ pathname: `/merging-account`, state: { result, memberidOri, memberidDes } });
                    } else {
                        Alert.error(status.responsemessage);
                    }
                    this.setState({ isLoading: false });
                })
            }
        });



    };

    render() {
        const { isLoading, membercardOri, membercardDes } = this.state;

        let cardnumberOri = (membercardOri === undefined || membercardOri.length === 0) ? '' : (membercardOri[0].membercards.length !== 0) ? membercardOri[0].membercards[0].cardnumber : '';
        let cardnumberDes = (membercardDes === undefined || membercardDes.length === 0) ? '' : (membercardDes[0].membercards.length !== 0) ? membercardDes[0].membercards[0].cardnumber : '';
        let nameOri = (membercardOri === undefined || membercardOri.length === 0) ? '' : membercardOri[0].nameoncard;
        let nameDes = (membercardDes === undefined || membercardDes.length === 0) ? '' : membercardDes[0].nameoncard;

        const configurationTableOrigin = {
            url: api.url.membertransaction.list,
            criteriadata: {
                memberid: this.props.memberOrigin,
                channel: "BO"
            },
            columns: [
                {
                    type: 'field', title: 'Trx Info', dataIndex: 'trxinfo',
                    render: (value, row, index) => {
                        let trxdate = row.trxdate ? moment(row.trxdate).format('DD/MM/YYYY') : '';
                        let trxtype = row.trxtype ? jsUcfirst(row.trxtype) : '-';
                        let comment = row.comment ? row.comment : '';
                        let trxinfo = `${trxdate} ${trxtype} - ${comment}`;
                        return trxinfo
                    }
                },
                {
                    type: 'field', title: 'Award Miles', dataIndex: 'awardmiles',
                    render: (value, row, index) => { return (value) ? value : '0' }
                },
                {
                    type: 'field', title: 'Tier Miles', dataIndex: 'tiermiles',
                    render: (value, row, index) => { return (value) ? value : '0' }
                },
                {
                    type: 'html', title: 'Frequency', dataIndex: 'frequency',
                    render: (value, row, index) => { return (value) ? value : '0' }
                },
            ]
        };
        const configurationTableDestination = {
            url: api.url.membertransaction.list,
            criteriadata: {
                memberid: this.props.memberDestination,
                channel: "BO"
            },
            columns: [
                {
                    type: 'field', title: 'Trx Info', dataIndex: 'trxinfo',
                    render: (value, row, index) => {
                        let trxdate = row.trxdate ? moment(row.trxdate).format('DD/MM/YYYY') : '';
                        let trxtype = row.trxtype ? jsUcfirst(row.trxtype) : '-';
                        let comment = row.comment ? row.comment : '';
                        let trxinfo = `${trxdate} ${trxtype} - ${comment}`;
                        return trxinfo
                    }
                },
                {
                    type: 'field', title: 'Award Miles', dataIndex: 'awardmiles',
                    render: (value, row, index) => { return (value) ? value : '0' }
                },
                {
                    type: 'field', title: 'Tier Miles', dataIndex: 'tiermiles',
                    render: (value, row, index) => { return (value) ? value : '0' }
                },
                {
                    type: 'html', title: 'Frequency', dataIndex: 'frequency',
                    render: (value, row, index) => { return (value) ? value : '0' }
                },
            ]
        };
        return (
            <React.Fragment>
                <Row>
                    <Spin spinning={isLoading}>
                        <Row gutter={24}>
                            <Col xs={24} sm={24} lg={12}>
                                <Card title={`${cardnumberOri} - ${nameOri}`} bordered={true} >
                                    <div style={{ background: '#ffffff', overflow: 'auto', height: '380px', width: '500px', paddingRight: '5px' }} >
                                        <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTableOrigin} style={{ marginBottom: 5 }} />
                                    </div>
                                </Card>
                            </Col>
                            <Col xs={24} sm={24} lg={12}>
                                <Card title={`${cardnumberDes} - ${nameDes}`} bordered={true} >
                                    <div style={{ background: '#ffffff', overflow: 'auto', height: '380px', width: '500px', paddingRight: '5px' }} >
                                        <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTableDestination} style={{ marginBottom: 5 }} />
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                        <Form onSubmit={this.getMergingAccount}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 6 }}>
                                <TextArea form={this.props.form} labeltext="Source Request" datafield="requestnotes1" maxLength={255} validationrules={['required']} />
                                <SelectBase form={this.props.form} labeltext="Channel Request" datafield="requestnotes2" options={optionsChannel} validationrules={['required']} />
                                <DatePickerBase form={this.props.form} labeltext="Date of Request" datafield="requestnotes3" validationrules={['required']} />
                                <TextArea form={this.props.form} labeltext="Details of Request" datafield="detailofrequest" maxLength={255} validationrules={['required']} />
                            </Col>
                            </Row>

                        </Form>
                        <Row gutter={24} type='flex' justify='center' style={{ marginTop: 20 }}>
                            <Col xs={12}>
                                <Button type='default' onClick={() => this.handleMenuCallback()}><Icon type='left' /> Previous </Button>
                            </Col>
                            <Col>
                                <Button type="primary" size="default" onClick={() => this.handleOpenModal()} >Continue Merge Process</Button>
                            </Col>
                        </Row>
                    </Spin>
                </Row>
            </React.Fragment>
        );
    }
}
export default Form.create()(App);
