import React from 'react';
import { api } from '../../config/Services';
import { DetailRequest } from '../../utilities/RequestService';
import { Button } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Spin, Divider, Card, Typography } from 'antd';
import moment from 'moment';

const { Title } = Typography;

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            fieldvalue: {
            },
            beforeData: [],
            afterData: []
        }
    }

    componentDidMount() {
        document.title = 'Details User Log Monitoring | Loyalty Management System';
        const { logid } = this.props;
        this.getDetail(logid);
    };

    getDetail = (logid = this.props.match.params.ID) => {
        let url = api.url.userlog.detail;
        let data = { logid };
        //call loader
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode === '0000') {
                if (result.length !== 0) {
                    let logid = (result.logid) ? result.logid : undefined;
                    let logtime = (result.logtime) ? moment(result.logtime).format('YYYY-MM-DD HH:mm:ss') : '';
                    let username = (result.username) ? result.username : undefined;
                    let databefore = undefined;
                    let dataafter = undefined;

                    const jsonParse = (data) => {
                        try {
                            return data ? JSON.parse(data) : undefined;
                        } catch (e) {
                            return data
                        }
                    }

                    databefore = jsonParse(result.databefore)
                    dataafter = jsonParse(result.dataafter)

                    // try {
                    //     databefore = (result.databefore) ? JSON.parse(result.databefore) : undefined;
                    // } catch (e) {
                    //     databefore = result.databefore
                    // }
                    // let dataafter = undefined;
                    // try {
                    //     dataafter = (result.dataafter) ? JSON.parse(result.dataafter) : undefined;
                    // } catch (e) {
                    //     dataafter = result.dataafter
                    // }
                    let datanamebefore = (result.datanamebefore) ? result.datanamebefore : undefined;
                    let datanameafter = (result.datanameafter) ? result.datanameafter : undefined;
                    let operation = (result.operation) ? result.operation.charAt(0).toUpperCase() + result.operation.slice(1).toLowerCase() : undefined;
                    let module = (result.module) ? result.module : undefined;
                    let submodule = (result.submodule) ? result.submodule : undefined;

                    const recursiveObject = (obj) => {
                        if (typeof obj === "string") {
                            return [{
                                label: "",
                                value: obj
                            }]
                        }
                        else if (typeof obj === "object" && !Array.isArray(obj) && Object.keys(obj).length) {
                            return Object.keys(obj).map(label => ({
                                label,
                                value: typeof obj[label] === "object" && obj[label] && Object.keys(obj).length
                                    ? (Array.isArray(obj[label]) ? (obj[label].length > 0 && typeof obj[label][0] === 'object' ? obj[label].map((o) => recursiveObject(o)).flat() : obj[label].join(", ")) : recursiveObject(obj[label]))
                                    : (
                                        ["object", "undefined"].includes(typeof obj[label])
                                            ? ""
                                            : obj[label].toString()
                                    )
                            }))
                        }
                        else return []
                    }

                    if (databefore) {
                        this.setState({ beforeData: recursiveObject(databefore) })
                    }
                    if (dataafter) {
                        this.setState({ afterData: recursiveObject(dataafter) })
                    }

                    // /** data before */
                    // let databeforearray = []
                    // let datafieldnamebefore = databefore ? Object.entries(databefore) : []
                    // for (let i in databefore) {
                    //     databeforearray.push(databefore[i])
                    // }

                    // /** data after */
                    // let dataafterarray = []
                    // let datafieldnameafter = dataafter ? Object.entries(dataafter) : []
                    // for (let i in dataafter) {
                    //     dataafterarray.push(dataafter[i])
                    // }

                    let fieldvalue = { ...this.state.fieldvalue, logid, logtime, username, databefore, dataafter, datanamebefore, datanameafter, operation, module, submodule };
                    this.setState({ fieldvalue });
                } else {
                    this.setState({ responseMessage: 'Data not found', formrender: false });
                }
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
            this.setState({ isLoading: false });
        });
    }

    render() {
        const { isLoading, fieldvalue, dataafterarray, datafieldnamebefore, datafieldnameafter } = this.state;
        const { logtime, username, datanameafter, datanamebefore, operation, module, submodule } = fieldvalue;
        // let databefore = [];
        // let dataafter = [];

        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 7 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 14 } }
        };

        // if (databeforearray !== undefined) {
        //     for (let i = 0; i < databeforearray.length; i++) {
        //         databefore[i] =
        //             <Row style={{ marginTop: 10 }}>
        //                 <Col xs={24} sm={24} md={24} lg={9} xl={9}>{datafieldnamebefore[i][0].toString()}</Col>
        //                 <Col xs={24} sm={24} md={24} lg={12} xl={12}>:&nbsp;
        //                     {typeof databeforearray[i] === "object" ? <div>
        //                         {React.Children.toArray(Object.keys(databeforearray[i]).map((name) => <Row>
        //                             <Col xs={24} sm={24} md={24} lg={12} xl={12}>&nbsp;&nbsp;{name}</Col>
        //                             <Col xs={24} sm={24} md={24} lg={12} xl={12}>: {databeforearray[i][name]}</Col>
        //                         </Row>))}
        //                     </div> : databeforearray[i].toString()}
        //                 </Col>
        //             </Row>
        //     }
        // }

        // if (dataafterarray !== undefined) {
        //     for (let i = 0; i < dataafterarray.length; i++) {
        //         dataafter[i] =
        //             <Row style={{ marginTop: 10 }}>
        //                 <Col xs={24} sm={24} md={24} lg={9} xl={9}>{datafieldnameafter[i][0].toString()}</Col>
        //                 <Col style={{ color: (databeforearray[i] !== dataafterarray[i]) ? 'red' : '' }} xs={24} sm={24} md={24} lg={12} xl={12}>:&nbsp;
        //                     {typeof dataafterarray[i] === "object" ? <div>
        //                         {React.Children.toArray(Object.keys(dataafterarray[i]).map((name) => <Row>
        //                             <Col xs={24} sm={24} md={24} lg={12} xl={12}>&nbsp;&nbsp;{name}</Col>
        //                             <Col xs={24} sm={24} md={24} lg={12} xl={12}>: {dataafterarray[i][name]}</Col>
        //                         </Row>))}
        //                     </div> : dataafterarray[i].toString()}
        //                 </Col>
        //             </Row>
        //     }
        // }


        const component = (before, after) => {
            return React.Children.toArray((after || before).map(({ label, value }, index) => typeof value === "object"
                ?
                <div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: after && operation !== 'Create' && operation !== 'Setdefault' ? (value === (before[index] ? before[index].value : "") ? "red" : "") : "" }}>
                        {label}
                    </div>
                    <div style={{ fontSize: '12px', color: after && operation !== 'Create' && operation !== 'Setdefault' ? (value === (before[index] ? before[index].value : "") ? "red" : "") : "", paddingLeft: "50px" }}>{component(value)}
                    </div>
                </div>

                : <Row style={{ marginTop: 10 }}>
                    <Col xs={24} sm={24} md={24} lg={9} xl={9} style={{ fontSize: '12px', fontWeight: '700', color: after && operation !== 'Create' && operation !== 'Setdefault' ? (value !== (before[index] ? before[index].value : "") ? "red" : "") : "" }}>{label}</Col>
                    <Col style={{ fontSize: '12px', color: after && operation !== 'Create' && operation !== 'Setdefault' ? (value !== (before[index] ? before[index].value : "") ? "red" : "") : "" }} xs={24} sm={24} md={24} lg={12} xl={12}>:&nbsp;
                        {value}
                    </Col>
                </Row>))
        }

        return (
            <Spin spinning={isLoading}>
                <Form {...formItemLayout}>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>Details Log Monitoring</Title>
                        </Col>
                        <Divider />
                        <Card bordered={false} className='card-shadow'>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 24, offset: 2 }} xl={{ span: 24, offset: 2 }}>
                                <Row style={{ marginTop: 10 }}>
                                    <Col xs={24} sm={24} md={24} lg={6} xl={5}><label> Time </label></Col>
                                    <Col xs={24} sm={24} md={24} lg={6} xl={6}>: {logtime ? logtime : '-'} </Col>
                                    <Col xs={24} sm={24} md={24} lg={6} xl={5}><label> Data Name Before </label></Col>
                                    <Col xs={24} sm={24} md={24} lg={6} xl={6}>: {datanamebefore ? datanamebefore : '-'} </Col>
                                </Row>
                                <Row style={{ marginTop: 10 }}>
                                    <Col xs={24} sm={24} md={24} lg={6} xl={5}><label> Username </label></Col>
                                    <Col xs={24} sm={24} md={24} lg={6} xl={6}>: {username ? username : '-'}</Col>
                                    <Col xs={24} sm={24} md={24} lg={6} xl={5}><label> Data Name After </label></Col>
                                    <Col xs={24} sm={24} md={24} lg={6} xl={6}>: {datanameafter ? datanameafter : '-'} </Col>
                                </Row>
                                <Row style={{ marginTop: 10 }}>
                                    <Col xs={24} sm={24} md={24} lg={6} xl={5}><label> Action </label></Col>
                                    <Col xs={24} sm={24} md={24} lg={6} xl={6}>: {operation ? operation : '-'}</Col>
                                </Row>
                                <Row style={{ marginTop: 10 }}>
                                    <Col xs={24} sm={24} md={24} lg={6} xl={5}><label> Module </label></Col>
                                    <Col xs={24} sm={24} md={24} lg={6} xl={6}>: {module ? module : '-'} </Col>
                                </Row>
                                <Row style={{ marginTop: 10, marginBottom: 30 }}>
                                    <Col xs={24} sm={24} md={24} lg={6} xl={5}><label> Sub Module </label></Col>
                                    <Col xs={24} sm={24} md={24} lg={6} xl={6}>: {submodule ? submodule : '-'}</Col>
                                </Row>
                            </Col>
                        </Card>
                    </Row>
                    <Divider></Divider>
                    <Row>
                        <Row gutter={24} style={{ marginBottom: 20 }}>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={12} xl={12} >
                                <Card style={{ background: '#f0f0f0' }} bordered={true} className='card-shadow'>
                                    <Col style={{ fontWeight: '700', textAlign: 'center' }} > Data Before </Col>
                                    {component(this.state.beforeData)}
                                    {/* {databefore} */}
                                </Card>
                            </Col>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={12} xl={12} >
                                <Card style={{ background: '#f0f0f0' }} bordered={true} className='card-shadow'>
                                    <Col style={{ fontWeight: '700', textAlign: 'center' }} >Data After </Col>
                                    {component(this.state.beforeData, this.state.afterData)}
                                    {/* {dataafter} */}
                                </Card>
                            </Col>
                        </Row>
                        <Row type="flex" justify="center" style={{ marginTop: 30 }}>
                            <Button url="/user-log" htmlType="link" type="default" label="Back" />
                        </Row>
                    </Row>
                </Form>
            </Spin >
        );
    }
}
export default Form.create()(App);