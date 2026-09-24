
import React from 'react';
import { api } from '../../../config/Services'
import { DetailRequest } from '../../../utilities/RequestService'
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
            this.props.handleMenuCallback({ choosen: 'retro-claim', current: 3 });
        } else {
            this.props.handleMenuCallback({ choosen: 'member-cobrand', current: 1, membership: 2 });
        }
    };

    render() {
        const { isLoading, membercardOri, membercardDes } = this.state;

        let cardnumberOri = (membercardOri === undefined || membercardOri.length === 0) ? '' : (membercardOri[0].membercards.length !== 0) ? membercardOri[0].membercards[0].cardnumber : '';
        let cardnumberDes = (membercardDes === undefined || membercardDes.length === 0) ? '' : (membercardDes[0].membercards.length !== 0) ? membercardDes[0].membercards[0].cardnumber : '';
        let nameOri = (membercardOri === undefined || membercardOri.length === 0) ? '' : membercardOri[0].nameoncard;
        let nameDes = (membercardDes === undefined || membercardDes.length === 0) ? '' : membercardDes[0].nameoncard;

        const configurationTableOrigin = {
            url: api.url.memberactivity.list,
            criteria: { memberid: this.props.memberOrigin },
            columns: [
                {
                    type: 'field', title: 'Activity Information', dataIndex: 'activityinformation',
                    render: (value, row, index) => {
                        let activitytype = row.activitytype ? jsUcfirst(row.activitytype, '_') : '';
                        let activityname = row.activityname ? row.activityname : '';
                        let activityinformation = `${activitytype} - ${activityname}`;
                        return activityinformation
                    }
                },
                {
                    type: 'field', title: 'Activity Date', dataIndex: 'activitydate',
                    render: (value, row, index) => { return value ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'field', title: 'Info', dataIndex: 'activityinfo',
                    render: (value, row, index) => { return value ? jsUcfirst(value, '_') : '-' }
                }
            ]
        };
        const configurationTableDestination = {
            url: api.url.memberactivity.list,
            criteria: { memberid: this.props.memberDestination },
            columns: [
                {
                    type: 'field', title: 'Activity Information', dataIndex: 'activityinformation',
                    render: (value, row, index) => {
                        let activitytype = row.activitytype ? jsUcfirst(row.activitytype, '_') : '';
                        let activityname = row.activityname ? row.activityname : '';
                        let activityinformation = `${activitytype} - ${activityname}`;
                        return activityinformation
                    }
                },
                {
                    type: 'field', title: 'Activity Date', dataIndex: 'activitydate',
                    render: (value, row, index) => { return value ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'field', title: 'Info', dataIndex: 'activityinfo',
                    render: (value, row, index) => { return value ? jsUcfirst(value, '_') : '-' }
                }
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
                                        <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTableOrigin} />
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
