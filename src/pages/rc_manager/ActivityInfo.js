import React from 'react';
import { DetailRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import ErrorGeneral from '../error/ErrorGeneral';
import { jsUcfirst } from '../../utilities/Helpers';
import { Form, Spin, Col, Row } from 'antd';
import moment from 'moment';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formrender: true,
            isLoading: false
        };
        this.closeAndRefresh = React.createRef();
    }

    componentDidMount() {
        this.getDetail(this.props.activityid);
    }

    getDetail = (activityid) => {
        let url = api.url.memberactivity.detail;
        let data = { activityid };
        //call loader
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let activitydate = result.activitydate ? moment(result.activitydate).format("DD/MM/YYYY") : '-';
                    let activityname = result.activityname ? result.activityname : '-';
                    let activityinfo = result.activityinfo ? jsUcfirst(result.activityinfo, "_") : '-';

                    this.setState({ activitydate, activityname, activityinfo });
                } else {
                    this.setState({ responseMessage: 'Data not found', formrender: false });
                }
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
            this.setState({ isLoading: false });
        });
    }

    closeModalSuccess = () => {
        this.closeAndRefresh.current.click();
    }

    render() {
        const { formrender, isLoading } = this.state;
        const { activitydate, activityname, activityinfo } = this.state;

        if (formrender) {
            return (
                <React.Fragment>
                    <Spin spinning={isLoading}>
                        <Form onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" lg={{ span: 20, offset: 4 }}>
                                    <Col xs={24} xl={8}><label>Activity Date</label></Col>
                                    <Col xs={24} xl={16}>: {activitydate}</Col>
                                    <Col xs={24} xl={8}><label>Activity Name</label></Col>
                                    <Col xs={24} xl={16}>: {activityname}</Col>
                                    <Col xs={24} xl={8}><label>Activity Info</label></Col>
                                    <Col xs={24} xl={16}>: {activityinfo}</Col>
                                </Col>
                            </Row>
                        </Form>
                    </Spin>
                </React.Fragment>
            )
        } else {
            return (<ErrorGeneral {...this.props} message={this.state.responseMessage} type="modal" />);
        }
    }
}

export default Form.create()(App);