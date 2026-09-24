import React from 'react';
import { RetrieveRequest, DeleteRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import { Alert, Button } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Card, Spin } from 'antd';
import moment from 'moment';
import htmlToText from 'html-to-text';

const prefixmenuname = 'NEWS';
const menucode = 'NEWS';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 1,
            pageSize: 10,
            criteria: {},
            loading: false,
            dataList: [],
            active: null,
            id: this.props.id
        };
        this.closeAndRefresh = React.createRef();
    }

    componentDidMount() {
        this.getDetail(this.state.id);
    }

    getDetail = (id) => {
        let url = api.url.communication.list;
        let criteria = { id };
        //call loader
        this.setState({ loading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let dataList = result[0] ? result[0] : null;
                    let active = (result[0].active) ? result[0].active : false;

                    this.setState({ active, dataList });
                } else {
                    this.setState({ responseMessage: 'Data not found', formrender: false });
                }
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
            this.setState({ loading: false });
        });
    }

    deleteData(id, active) {
        let url = (active) ? api.url.communication.deactivate : api.url.communication.activate;
        let data = { id };
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode.substring(0, 1) === '0') {
                let message = (responsemessage) ? responsemessage : 'Selected data has been deleted';
                Alert.success(message);
            } else {
                Alert.error(responsemessage);
            }
            this.closeModalSuccess();
        };
        DeleteRequest(url, data, callback, active, 'termination');
    }

    closeModalSuccess = () => {
        this.closeAndRefresh.current.click();
    }

    render() {
        const { dataList, active, loading } = this.state;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 },
            labelAlign: 'left',
            colon: false
        };
        const formItemStyle = {
            style: {
                marginTop: 0,
                marginBottom: 0
            }
        }

        return (
            <React.Fragment>
                <Spin spinning={loading}>
                    <Row>
                        <Form {...formItemLayout} loading={loading}>
                            <Form.Item label="Reference Number" {...formItemStyle}>
                                <span className="ant-form-text">: {dataList.referencenum}</span>
                            </Form.Item>
                            <Form.Item label="Is All Group" {...formItemStyle}>
                                <span className="ant-form-text">: {(dataList.isallgroup) ? 'Yes' : 'No'}</span>
                            </Form.Item>
                            <Form.Item label="Title" {...formItemStyle}>
                                <span className="ant-form-text">: {dataList.title}</span>
                            </Form.Item>
                            <Form.Item label="Effective Date" {...formItemStyle}>
                                <span className="ant-form-text">: {moment(dataList.effectivedate).format('DD/MM/YYYY')}</span>
                            </Form.Item>
                            <Form.Item label="Discontinue Date" {...formItemStyle}>
                                <span className="ant-form-text">: {moment(dataList.discontinuedate).format('DD/MM/YYYY')}</span>
                            </Form.Item>
                        </Form>
                    </Row>
                    <Row gutter={24}>
                        <Col span={7}><Card className="communication-thumbnail" cover={<img alt="News" src={dataList.image} />} /></Col>
                        <Col span={17}>
                            <div><label>Content</label></div>
                            <div align="justify">
                                {dataList.content ? htmlToText.fromString((dataList.content.length > 150) ? htmlToText.fromString(dataList.content).substring(0, 150) + '...' : htmlToText.fromString(dataList.content)) : ''}
                            </div>
                        </Col>
                        <Col xs={24} xl={24} align="right" style={{ marginTop: 10 }}>
                            {
                                (active) ?
                                    <Button htmlType="button" type="danger" size="small" label="Terminate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(dataList.id, active)} /> :
                                    <Button htmlType="button" type="primary" size="small" label="Reactivate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(dataList.id, active)} />
                            }
                            <button type="button" ref={this.closeAndRefresh} onClick={this.props.closemodalrefresh} className="hidden">Close Refresh</button>
                        </Col>
                    </Row>
                </Spin>
            </React.Fragment>
        );
    }
}

export default Form.create()(App);