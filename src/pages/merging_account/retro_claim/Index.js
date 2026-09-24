
import React from 'react';
import { api } from '../../../config/Services';
import { DetailRequest } from '../../../utilities/RequestService';
import { TableBase, Alert } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Card, Button, Icon, Spin } from 'antd';
import { jsUcfirst } from '../../../utilities/Helpers';
import moment from 'moment';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            membercardOri: [],
            membercardDes: [],
            isLoading: false
        }
    };

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

    handleMenuCallback = (type) => {
        if (type === 'next') {
            this.props.handleMenuCallback({ choosen: 'transaction', current: 4 });
        } else {
            this.props.handleMenuCallback({ choosen: 'activity', current: 2 });
        }
    };

    render() {
        const { isLoading, membercardOri, membercardDes } = this.state;

        let cardnumberOri = (membercardOri === undefined || membercardOri.length === 0) ? '' : (membercardOri[0].membercards.length !== 0) ? membercardOri[0].membercards[0].cardnumber : '';
        let cardnumberDes = (membercardDes === undefined || membercardDes.length === 0) ? '' : (membercardDes[0].membercards.length !== 0) ? membercardDes[0].membercards[0].cardnumber : '';
        let nameOri = (membercardOri === undefined || membercardOri.length === 0) ? '' : membercardOri[0].nameoncard;
        let nameDes = (membercardDes === undefined || membercardDes.length === 0) ? '' : membercardDes[0].nameoncard;

        const configurationTableOrigin = {
            url: api.url.retroclaim.list,
            criteria: { memberid: this.props.memberOrigin },
            columns: [
                {
                    type: 'field', title: 'Flight Info', dataIndex: 'ffpcarriercode',
                    render: (value, row, index) => {
                        let operatingairline = row.operatingairline ? `${row.operatingairline}, ` : '';
                        let operatingfltnumber = row.operatingfltnumber ? `${row.operatingfltnumber}, ` : '';
                        let origin = row.origin ? row.origin : '';
                        let destination = row.destination ? row.destination : '';
                        let departuredate = row.departuredate ? moment(row.departuredate).format('DD/MM/YYYY') : '';
                        let ffpcarriercode = `${operatingairline} ${operatingfltnumber} ${origin}-${destination}, ${departuredate}`
                        return ffpcarriercode;
                    }
                },
                {
                    type: 'html', title: 'Request Info', dataIndex: 'reqinfo',
                    render: (value, row, index) => { return (value) ? jsUcfirst(value, '_') : '-' }
                },
            ]
        };
        const configurationTableDestination = {
            url: api.url.retroclaim.list,
            criteria: { memberid: this.props.memberDestination },
            columns: [
                {
                    type: 'field', title: 'Flight Info', dataIndex: 'ffpcarriercode',
                    render: (value, row, index) => {
                        let operatingairline = row.operatingairline ? `${row.operatingairline}, ` : '';
                        let operatingfltnumber = row.operatingfltnumber ? `${row.operatingfltnumber}, ` : '';
                        let origin = row.origin ? row.origin : '';
                        let destination = row.destination ? row.destination : '';
                        let departuredate = row.departuredate ? moment(row.departuredate).format('DD/MM/YYYY') : '';
                        let ffpcarriercode = `${operatingairline} ${operatingfltnumber} ${origin}-${destination}, ${departuredate}`
                        return ffpcarriercode;
                    }
                },
                {
                    type: 'html', title: 'Request Info', dataIndex: 'reqinfo',
                    render: (value, row, index) => { return (value) ? jsUcfirst(value, '_') : '-' }
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
                                        <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTableOrigin} scroll={true} />
                                    </div>
                                </Card>
                            </Col>
                            <Col xs={24} sm={24} lg={12}>
                                <Card title={`${cardnumberDes} - ${nameDes}`} bordered={true} >
                                    <div style={{ background: '#ffffff', overflow: 'auto', height: '380px', width: '500px', paddingRight: '5px' }} >
                                        <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTableDestination} />
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                        <Row gutter={24} type='flex' justify='center' style={{ marginTop: 20 }}>
                            <Col xs={12}>
                                <Button type='default' onClick={() => this.handleMenuCallback('prev')}><Icon type='left' /> Previous </Button>
                            </Col>
                            <Col>
                                <Button type='primary' onClick={() => this.handleMenuCallback('next')}> Next  <Icon type='right' /></Button>
                            </Col>
                        </Row>
                    </Spin>
                </Row>
            </React.Fragment>
        );
    }
}
export default Form.create()(App);
