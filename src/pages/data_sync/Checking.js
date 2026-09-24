import React from 'react';
import { api } from '../../config/Services';
import { Button, InputText, Alert, TableBase } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Spin, Card } from 'antd';
import { DetailRequest } from '../../utilities/RequestService';
import moment from 'moment';

const { Title, Text } = Typography;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            showTable: false,
            responsecode: null,
            cardnumber: null,
            retryCount: 0,
        }
    }

    componentDidMount() {
        document.title = "Data Sync Checking | Loyalty Management System";
    }

    getList() {
        let url = api.url.datasync.check;
        let data = this.state.data;
        //call loader
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode === '0000' && result) {
                let amadeus = result.amadeus;
                let amala = result.amala;

                this.setState({ amadeus, amala, isLoading: false });
            } else {
                Alert.error(status.responsemessage)
                this.setState({ isLoading: false });
            }
        });
    }

    handleSearch = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) return;

            let criteria = {};
            Object.keys(values).forEach(key => {
                if (key === 'email') {
                    criteria[key] = values[key] ? `%${values[key]}%` : null;
                } else {
                    criteria[key] = values[key] !== undefined ? values[key] : null;
                }
            });

            let cardnumber = criteria.cardnumber;
            let email = criteria.email;

            if (!cardnumber && !email) {
                Alert.error('Card Number atau Email harus diisi');
                return;
            }

            this.setState({ data: { cardnumber, email }, showTable: false }, () => this.getList());
        });
    };


    handleReset = () => {
        this.props.form.resetFields();
        this.setState({ amala: null, amadeus: null });
    };

    retry = () => {
        const url = api.url.datasync.retry;
        const cardnumber = this.props.form.getFieldValue("cardnumber");
        if (!cardnumber) {
            Alert.error("Card Number tidak boleh kosong");
            return;
        }
        this.setState({ isLoading: true, showTable: false });
        DetailRequest(url, { cardnumber }).then((response) => {
            const { status } = response;
            const { responsecode, responsemessage } = status;
            if (responsecode === "0000") {
                Alert.success("Request Success, please check data monitoring");
                this.setState((prev) => ({ responsecode, cardnumber, retryCount: prev.retryCount + 1, showTable: false }));
                setTimeout(() => {
                    this.setState({ showTable: true, isLoading: false, });
                }, 5000);
            } else {
                Alert.error(responsemessage);
                this.setState({ isLoading: false, showTable: false });
            }
        });
    };

    render() {
        const { isLoading, amadeus, amala } = this.state;
        const cardnumber = this.props.form.getFieldValue("cardnumber");
        const formatXML = (xml) => {
            if (typeof xml !== 'string') return '';
            let formatted = '';
            const reg = /(>)(<)(\/*)/g;
            xml = xml.replace(reg, '$1\r\n$2$3');
            let pad = 0;
            xml.split('\r\n').forEach((node) => {
                let indent = 0;
                if (node.match(/.+<\/\w[^>]*>$/)) {
                    indent = 0;
                } else if (node.match(/^<\/\w/)) {
                    if (pad !== 0) pad -= 2;
                } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
                    indent = 2;
                }
                formatted += new Array(pad + 1).join(' ') + node + '\r\n';
                pad += indent;
            });
            return formatted.trim();
        };
        const configurationTable = {
            url: api.url.datasync.list,
            criteria: { cardnumber: cardnumber },
            sort: { syncdate: 'desc' },
            columns: [
                { type: 'field', title: 'Type', dataIndex: 'type', sorter: true },
                { type: 'field', title: 'Card Number', dataIndex: 'cardnumber', sorter: true },
                { type: 'field', title: 'Operation', dataIndex: 'operation', sorter: true },
                {
                    type: 'html', title: 'Sequence Number', dataIndex: 'sequencenumber', sorter: true,
                    render: (value, row, index) => { return value ? value : '-' }
                },
                {
                    type: 'html', title: 'Sync Date', dataIndex: 'syncdate', sorter: true, width: '8%',
                    render: (value, row, index) => { return (value) ? moment(value).format('DD-MM-YYYY HH:mm:ss') : '' }
                },
                { type: 'field', title: 'Status', dataIndex: 'status', sorter: true },
                {
                    type: 'html', title: 'CsxNumber', dataIndex: 'csxnumber', sorter: true,
                    render: (value, row, index) => { return value ? value : '-' }
                },
                {
                    type: 'html', title: 'ErrorCode', dataIndex: 'errorcode', sorter: true,
                    render: (value, row, index) => { return value ? value : '-' }
                },
                {
                    type: 'html', title: 'Request', dataIndex: 'request', width: '20%',
                    render: (value, row, index) => {
                        if (!value || !Object.keys(value).length) return '-';

                        let str = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
                        str = str.replace(/\\n/g, '\n');

                        const key = `showmorerequest${index}`;
                        const show = this.state[key];
                        const limit = 60;

                        return (
                            <div>
                                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>
                                    {show ? str : str.slice(0, limit) + (str.length > limit ? '...' : '')}
                                </pre>
                                {str.length > limit && (
                                    <a onClick={() => this.setState({ [key]: !show })}>
                                        {show ? 'Show Less . . .' : 'Show More . . .'}
                                    </a>
                                )}
                            </div>
                        );
                    }
                },
                {
                    type: 'html', title: 'Response', dataIndex: 'response', width: '20%',
                    render: (value, _, i) => {
                        if (!value || !Object.keys(value).length) return '-';

                        let str = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
                        str = str.trim().startsWith('<') ? formatXML(str) : str.replace(/\\n/g, '\n');

                        const key = `showmoresponse${i}`;
                        const show = this.state[key];
                        const limit = 60;
                        const text = show ? str : str.slice(0, limit) + (str.length > limit ? '...' : '');

                        return (
                            <div>
                                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>{text}</pre>
                                {str.length > limit && (
                                    <a onClick={() => this.setState({ [key]: !show })}>
                                        {show ? 'Show Less . . .' : 'Show More . . .'}
                                    </a>
                                )}
                            </div>
                        );
                    }
                },
            ]
        };

        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Data Sync Checking</Title>
                    </Col>
                    <Divider />
                </Row>
                <Spin spinning={isLoading}>
                    <Form layout="inline" onSubmit={this.handleSearch}>
                        <Row gutter={24}>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
                                <Card>
                                    <InputText form={this.props.form} placeholder="Card Number" datafield="cardnumber" validationrules={['pattern.number']} maxLength={9} />
                                    <InputText form={this.props.form} placeholder="Email" datafield="email" validationrules={['pattern.email']} />
                                    <span style={{ lineHeight: '40px' }}>
                                        <Button label="Search" size="default" type="primary" htmlType="submit" />
                                        <Button label="Clear" size="default" style={{ marginLeft: 8 }} onClick={this.handleReset} htmlType="button" />
                                    </span>
                                </Card>
                            </Col>

                        </Row>
                        <Row style={{ marginTop: 20 }}>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={11} xl={11}>
                                <Card bordered={false} style={{ marginBottom: '20px' }} className='card-shadow'>
                                    <Divider orientation='center'> <Text strong> AMALA </Text> </Divider>
                                    <Row style={{ marginTop: 10 }}>
                                        <Col xs={24} sm={24} md={24} lg={6} xl={6}><label> Card Number </label></Col>
                                        <Col xs={24} sm={24} md={24} lg={18} xl={18}>: {amala?.cardnumber ?? '-'} </Col>
                                    </Row>
                                    <Row style={{ marginTop: 13 }}>
                                        <Col xs={24} sm={24} md={24} lg={6} xl={6}><label> Status </label></Col>
                                        <Col xs={24} sm={24} md={24} lg={18} xl={18}>: {amala?.status ?? '-'} </Col>
                                    </Row>
                                    <Row style={{ marginTop: 13 }}>
                                        <Col xs={24} sm={24} md={24} lg={6} xl={6}><label> Email </label></Col>
                                        <Col xs={24} sm={24} md={24} lg={18} xl={18}>: {amala?.email ?? '-'} </Col>
                                    </Row>
                                    <Row style={{ marginTop: 13 }}>
                                        <Col xs={24} sm={24} md={24} lg={6} xl={6}><label> Name </label></Col>
                                        <Col xs={24} sm={24} md={24} lg={18} xl={18}>: {amala?.membername ?? '-'} </Col>
                                    </Row>
                                    <Row style={{ marginTop: 13 }}>
                                        <Col xs={24} sm={24} md={24} lg={6} xl={6}><label> Gender </label></Col>
                                        <Col xs={24} sm={24} md={24} lg={18} xl={18}>: {amala?.gender ?? '-'} </Col>
                                    </Row>
                                    <Row style={{ marginTop: 13 }}>
                                        <Col xs={24} sm={24} md={24} lg={6} xl={6}><label> Date of Birth </label></Col>
                                        <Col xs={24} sm={24} md={24} lg={18} xl={18}>: {amala?.dateofbirth ? moment(amala.dateofbirth).format("DD-MM-YYYY") : '-'} </Col>
                                    </Row>
                                    <Row style={{ marginTop: 13 }}>
                                        <Col xs={24} sm={24} md={24} lg={6} xl={6}><label> Address </label></Col>
                                        <Col xs={24} sm={24} md={24} lg={18} xl={18}>: {amala?.address?.addressline ?? '-'} </Col>
                                    </Row>
                                    <Row style={{ marginTop: 13 }}>
                                        <Col xs={24} sm={24} md={24} lg={6} xl={6}><label> Postal Code </label></Col>
                                        <Col xs={24} sm={24} md={24} lg={18} xl={18}>: {amala?.address?.postalcode ?? '-'} </Col>
                                    </Row>
                                    <Row style={{ marginTop: 13 }}>
                                        <Col xs={24} sm={24} md={24} lg={6} xl={6}><label> Contact </label></Col>
                                        <Col xs={24} sm={24} md={24} lg={18} xl={18}>: {amala?.contact?.phonenumber ?? '-'} </Col>
                                    </Row>
                                    <Row style={{ marginTop: 13, marginBottom: 4 }}>
                                        <Col xs={24} sm={24} md={24} lg={6} xl={6}><label> Tier </label></Col>
                                        <Col xs={24} sm={24} md={24} lg={18} xl={18}>: {amala?.tier ?? '-'} </Col>
                                    </Row>
                                </Card>
                            </Col>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={2} xl={2}></Col>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={11} xl={11}>
                                <Card bordered={false} style={{ marginBottom: '20px' }} className='card-shadow'>
                                    <Divider orientation='center'> <Text strong> AMADEUS </Text> </Divider>
                                    <Row style={{ marginTop: 10 }}>
                                        <Col xs={24} sm={24} md={24} lg={6} xl={6}><label> Card Number </label></Col>
                                        <Col xs={24} sm={24} md={24} lg={18} xl={18} style={{ color: (amala?.cardnumber ?? '') !== (amadeus?.cardnumber ?? '') ? 'red' : '' }}>: {amadeus?.cardnumber ?? '-'} </Col>
                                    </Row>
                                    <Row style={{ marginTop: 10 }}>
                                        <Col xs={24} sm={24} md={24} lg={6} xl={6}><label> Email </label></Col>
                                        <Col xs={24} sm={24} md={24} lg={18} xl={18} style={{ color: (amala?.email ?? '') !== (amadeus?.email ?? '') ? 'red' : '' }}>: {amadeus?.email ?? '-'} </Col>
                                    </Row>
                                    <Row style={{ marginTop: 10 }}>
                                        <Col xs={24} sm={24} md={24} lg={6} xl={6}><label> Name </label></Col>
                                        <Col xs={24} sm={24} md={24} lg={18} xl={18} style={{ color: (amala?.membername ?? '') !== (amadeus?.membername ?? '') ? 'red' : '' }}>: {amadeus?.membername ?? '-'} </Col>
                                    </Row>
                                    <Row style={{ marginTop: 10 }}>
                                        <Col xs={24} sm={24} md={24} lg={6} xl={6}><label> Gender </label></Col>
                                        <Col xs={24} sm={24} md={24} lg={18} xl={18} style={{ color: (amala?.gender ?? '') !== (amadeus?.gender ?? '') ? 'red' : '' }}>: {amadeus?.gender ?? '-'} </Col>
                                    </Row>
                                    <Row style={{ marginTop: 10 }}>
                                        <Col xs={24} sm={24} md={24} lg={6} xl={6}><label> Date of Birth </label></Col>
                                        <Col xs={24} sm={24} md={24} lg={18} xl={18} style={{ color: (amala?.dateofbirth ?? '') !== (amadeus?.dateofbirth ?? '') ? 'red' : '' }}>: {amadeus?.dateofbirth ? moment(amadeus.dateofbirth).format("DD-MM-YYYY") : '-'} </Col>
                                    </Row>
                                    <Row style={{ marginTop: 10 }}>
                                        <Col xs={24} sm={24} md={24} lg={6} xl={6}><label> Address </label></Col>
                                        <Col xs={24} sm={24} md={24} lg={18} xl={18} style={{ color: (amala?.address?.addressline ?? '') !== (amadeus?.address?.addressline ?? '') ? 'red' : '' }}>: {amadeus?.address?.addressline ?? '-'} </Col>
                                    </Row>
                                    <Row style={{ marginTop: 10 }}>
                                        <Col xs={24} sm={24} md={24} lg={6} xl={6}><label> Postal Code </label></Col>
                                        <Col xs={24} sm={24} md={24} lg={18} xl={18} style={{ color: (amala?.address?.postalcode ?? '') !== (amadeus?.address?.postalcode ?? '') ? 'red' : '' }}>: {amadeus?.address?.postalcode ?? '-'} </Col>
                                    </Row>
                                    <Row style={{ marginTop: 10 }}>
                                        <Col xs={24} sm={24} md={24} lg={6} xl={6}><label> Contact </label></Col>
                                        <Col xs={24} sm={24} md={24} lg={18} xl={18} style={{ color: (amala?.contact?.phonenumber ?? '') !== (amadeus?.contact?.phonenumber ?? '') ? 'red' : '' }}>: {amadeus?.contact?.phonenumber ?? '-'} </Col>
                                    </Row>
                                    <Row style={{ marginTop: 10 }}>
                                        <Col xs={24} sm={24} md={24} lg={6} xl={6}><label> Tier </label></Col>
                                        <Col xs={24} sm={24} md={24} lg={18} xl={18} style={{ color: (amala?.tier ?? '') !== (amadeus?.tier ?? '') ? 'red' : '' }}>: {amadeus?.tier ?? '-'} </Col>
                                    </Row>
                                    <Row style={{ marginTop: 10 }}>
                                        <Col xs={24} sm={24} md={24} lg={6} xl={6}><label> Sequence Number </label></Col>
                                        <Col xs={24} sm={24} md={24} lg={18} xl={18} style={{ color: (amala?.sequencenumber ?? '') !== (amadeus?.sequencenumber ?? '') ? 'red' : '' }}>: {amadeus?.sequencenumber ?? '-'} </Col>
                                    </Row>
                                    <Row style={{ marginTop: 10 }}>
                                        <Col xs={24} sm={24} md={24} lg={6} xl={6}><label> CSX Number </label></Col>
                                        <Col xs={24} sm={24} md={24} lg={18} xl={18} style={{ color: (amala?.csx ?? '') !== (amadeus?.csx ?? '') ? 'red' : '' }}>: {amadeus?.csx ?? '-'} </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                        <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10, marginBottom: 30 }}>
                            <Button htmlType="button" onClick={() => this.retry()} type='primary' label='Synchronize Member'></Button>
                        </Row>
                    </Form>
                </Spin>
                <Row>
                    <Col className="gutter-row" xs={24} xl={24}>
                        {this.state.responsecode === "0000" && this.state.showTable && (
                            <TableBase key={`${this.state.cardnumber}-${this.state.retryCount}`} ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
                        )}
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

export default Form.create()(App);