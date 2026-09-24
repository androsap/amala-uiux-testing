import React from 'react';
import { DetailRequest, SaveRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import ErrorGeneral from '../error/ErrorGeneral';
import { Button, Alert } from '../../components/Base/BaseComponent';
import { Form, Spin, Col, Row } from 'antd';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formrender: true,
            loading: false
        };
        this.closeAndRefresh = React.createRef();
    }

    componentDidMount() {
        this.getDetail(this.props.cardnumberissuedid);
    }

    getDetail = (cardnumberissuedid) => {
        let url = api.url.cardnumber.cardnumberofuse;
        let data = { cardnumberissuedid };
        //call loader
        this.setState({ loading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let cardnumberissuedid = result.cardnumberissuedid ? result.cardnumberissuedid : '-';
                    let cardissuedsize = result.cardissuedsize ? result.cardissuedsize : '-';
                    let activealias = result.activealias ? result.activealias : '-';
                    let available = result.available ? result.available : '-';
                    let assigned = result.assigned ? result.assigned : '-';
                    let reserved = result.reserved ? result.reserved : '-';
                    let released = result.released ? result.released : '-';

                    this.setState({ cardnumberissuedid, cardissuedsize, activealias, available, assigned, reserved, released });
                } else {
                    this.setState({ responseMessage: 'Data not found', formrender: false });
                }
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
            this.setState({ loading: false });
        });
    }

    saveAction = (e, which) => {
        e.preventDefault();
        this.setState({ loading: true });
        //define parameter
        let cardnumberissuedid = this.props.cardnumberissuedid;
        let type = which === 'detail' ? 'DETAIL' : 'NUMBERONLY';

        let message = 'Downloading file...';
        let url = api.url.cardnumber.cardissuedreporting;
        let data = { cardnumberissuedid, type };

        SaveRequest(url, data).then((response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode.substring(0, 1) === '0') {
                window.location.href = response.result.url;
                message = (responsemessage) ? responsemessage : message;
                Alert.success(message);
                this.closeModalSuccess();
            } else {
                Alert.error(responsemessage);
            }
            //hide loader
            this.setState({ loading: false });
        })
    };
    
    closeModalSuccess = () => {
        this.closeAndRefresh.current.click();
    }

    render() {
        const { formrender, loading } = this.state;
        const { cardissuedsize, assigned, released, reserved, activealias, available } = this.state;

        if (formrender) {
            return (
                <React.Fragment>
                    <Spin spinning={loading}>
                        <Form onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" span={12}>
                                    <Col xs={24} xl={12}><label>Amount</label></Col>
                                    <Col xs={24} xl={12}>: {cardissuedsize}</Col>
                                    <Col xs={24} xl={12}><label>Assigned</label></Col>
                                    <Col xs={24} xl={12}>: {assigned}</Col>
                                    <Col xs={24} xl={12}><label>Active Alias</label></Col>
                                    <Col xs={24} xl={12}>: {activealias}</Col>
                                </Col>
                                <Col className="gutter-row" span={12}>
                                    <Col xs={24} xl={12}><label>Available</label></Col>
                                    <Col xs={24} xl={12}>: {available}</Col>
                                    <Col xs={24} xl={12}><label>Reserved</label></Col>
                                    <Col xs={24} xl={12}>: {reserved}</Col>
                                    <Col xs={24} xl={12}><label>Released</label></Col>
                                    <Col xs={24} xl={12}>: {released}</Col>
                                </Col>
                            </Row>
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 30 }}>
                                <Button htmlType="button" type="primary" label="Detail" onClick={(e) => this.saveAction(e, 'detail')} id="detail" />
                                <Button htmlType="button" type="primary" label="Number Only" onClick={(e) => this.saveAction(e, 'number-only')} id="number-only" />
                                <button type="button" ref={this.closeAndRefresh} onClick={this.props.closemodalrefresh} className="hidden">Close Refresh</button>
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