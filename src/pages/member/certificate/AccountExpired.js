import React from 'react';
import { Form, Typography, Card, Row, Col, Table, Spin, Modal } from 'antd';
import { api } from '../../../config/Services';
import { DetailRequest, SaveRequest } from '../../../utilities/RequestService';
import { DatePickerBase, Button, Alert } from '../../../components/Base/BaseComponent';
import { formatNumber } from '../../../utilities/Helpers';
import moment from 'moment';

const { Column } = Table;
const { confirm } = Modal;
const { Text } = Typography;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            fieldvalue: {
                expiredawardmiles: null,
                expiredtiermiles: null,
                expiredfrequency: null
            },
            dataList: []
        }

        this.expirationAction = this.expirationAction.bind(this);
    }

    componentDidMount() {
        this.getList();
    }

    getList = () => {
        let url = api.url.membertransaction.detail;
        let certificateid = (this.props.certificateid) ? this.props.certificateid : null;
        let data = { certificateid };
        //call loader
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                const number = 0;
                let dataList = result.trxdetail.map((obj, key) => { return ({ number: number + (key + 1), ...obj }) });
                dataList = dataList.filter(val => val.isexpired === true || moment(val.expireddate).format("YYYY/MM/DD") < moment().format("YYYY/MM/DD"));

                const expiredawardmiles = (result.expiredawardmiles !== null && result.expiredawardmiles !== undefined) ? result.expiredawardmiles : null;
                const expiredtiermiles = (result.expiredtiermiles !== null && result.expiredtiermiles !== undefined) ? result.expiredtiermiles : null;
                const expiredfrequency = (result.expiredfrequency !== null && result.expiredfrequency !== undefined) ? result.expiredfrequency : null;

                const fieldvalue = { ...this.state.fieldvalue, expiredawardmiles, expiredtiermiles, expiredfrequency };

                this.props.form.setFieldsValue({ extenddate: moment() });

                this.setState({ fieldvalue, dataList, isLoading: false });
            } else {
                this.setState({ isLoading: false, responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
        });
    }

    /* handle expiration process */
    expirationAction = (e, expirationconfirmation = false, callbackcoreprocess, errormessage = null) => {
        if (expirationconfirmation) {
            const callbackCancel = () => {
                this.expirationAction();
            }
            const callbackOk = () => {
                /* show loading */
                this.setState({ isLoading: true });
                /* handle for change schedule */
                if (this.props.confirmtype === 'UPDATE') {
                    this.props.onChangeScheduleAction(e, this.expirationAction);
                } else if (this.props.confirmtype === 'CANCEL') {
                    this.props.onCancellationAction(e, this.expirationAction);
                }
            }

            errormessage = (errormessage) ? errormessage : '-';
            if (this.props.confirmtype === 'UPDATE') {
                confirm({
                    title: 'Change schedule process is fail, because ' + errormessage + ', please try again',
                    onOk() { callbackOk(); },
                    okText: "Yes, Change Schedule",
                    cancelText: "No",
                    onCancel() { callbackCancel(); },
                });
            } else if (this.props.confirmtype === 'CANCEL') {
                confirm({
                    title: 'Refund process is fail, because ' + errormessage + ', please try again',
                    onOk() { callbackOk(); },
                    okText: "Yes, Refund",
                    cancelText: "No",
                    onCancel() { callbackCancel(); },
                });
            }
        } else {
            const callbackOk = () => { this.expirationAction(); }
            const callbackCancel = () => { this.props.showNewCertificate() };

            const { dataList } = this.state;
            const trxdate = moment().format("YYYY-MM-DD");
            const memberid = (this.props.memberid) ? this.props.memberid : null;
            const expiredaccounts = dataList.map((obj, key) => { return obj.accountdetailid });
            const data = { trxdate, memberid, expiredaccounts };

            let message = 'Data has been updated';
            let url = api.url.transaction.expiration;
            /* show loading */
            this.setState({ isLoading: true });
            SaveRequest(url, data).then((response) => {
                let { responsecode, responsemessage } = response.status;
                if (responsecode.substring(0, 1) === '0') {
                    message = (responsemessage) ? responsemessage : message;

                    if (callbackcoreprocess) { callbackcoreprocess(); }
                } else {
                    responsemessage = (responsemessage) ? responsemessage : '-';
                    confirm({
                        title: 'Expiration process is fail, because ' + responsemessage + ', please try again',
                        onOk() { callbackOk(); },
                        okText: "Set Expired",
                        cancelText: "Close",
                        onCancel() { callbackCancel(); },
                    });
                }

                /* hide loading */
                this.setState({ isLoading: false });
            });
        }
    }

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                /* show loading */
                this.setState({ isLoading: true });

                const { dataList } = this.state;
                const trxdate = moment().format("YYYY-MM-DD");
                const memberid = (this.props.memberid) ? this.props.memberid : null;
                const extendtype = 'DATE';
                const extendduration = null;
                const extenddate = (input.extenddate) ? moment(input.extenddate).format("YYYY-MM-DD") : null;
                const extendsaccounts = dataList.map((obj, key) => { return obj.accountdetailid });
                const data = { trxdate, memberid, extendtype, extendduration, extenddate, extendsaccounts };

                let message = 'Data has been updated';
                let url = api.url.transaction.extension;
                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;

                        /* handle for change schedule */
                        if (this.props.confirmtype === 'UPDATE') {
                            this.props.onChangeScheduleAction(e, this.expirationAction);
                        } else if (this.props.confirmtype === 'CANCEL') {
                            this.props.onCancellationAction(e, this.expirationAction);
                        }

                        // this.props.handleCloseModal();
                    } else {
                        Alert.error(responsemessage);
                        //hide loader
                        this.setState({ isLoading: false });
                    }
                });
            }
        });
    }

    render() {
        const { confirmtype } = this.props;
        const { isLoading, dataList, fieldvalue } = this.state;
        const { expiredawardmiles, expiredtiermiles, expiredfrequency } = fieldvalue;

        return (
            <React.Fragment>
                <Spin spinning={isLoading}>
                    <Form onSubmit={this.saveAction}>
                        <Card title="Miles Expired Information" bordered={false} style={{ marginBottom: 20 }} className="card-shadow">
                            <Row gutter={24}>
                                <Col className="gutter-row" span={12}>
                                    <Col xs={24} xl={12}><label>Expired Award Miles</label></Col>
                                    <Col xs={24} xl={12}>: {(expiredawardmiles !== null) ? formatNumber(expiredawardmiles) : '-'} Miles</Col>
                                    <Col xs={24} xl={12}><label>Expired Tier Miles</label></Col>
                                    <Col xs={24} xl={12}>: {(expiredtiermiles !== null) ? formatNumber(expiredtiermiles) : '-'} Miles</Col>
                                    <Col xs={24} xl={12}><label>Expired Frequency</label></Col>
                                    <Col xs={24} xl={12}>: {(expiredfrequency !== null) ? formatNumber(expiredfrequency) : '-'}</Col>
                                </Col>
                            </Row>
                            <Row gutter={24} style={{ marginTop: '20px' }}>
                                <Col className="gutter-row" span={24}>
                                    <Table rowKey={record => record.number} rowClassName="editable-row" dataSource={dataList} size="middle" pagination={false} loading={isLoading} scroll={{ y: 450 }}>
                                        <Column title="No" dataIndex="number" key="number" render={(val, row, i) => i + 1} width="3%" />
                                        <Column title="Comment" dataIndex="comment" key="Comment" width="37%"
                                            render={(value, record) => (
                                                <span> {(value) ? value : '-'} </span>
                                            )} />
                                        <Column title="Award Miles" dataIndex="awardmiles" key="Award Miles" width="15%"
                                            render={(value, record) => (<span> {(value !== null) ? formatNumber(value) : '-'} </span>)} />
                                        <Column title="Tier Miles" dataIndex="tiermiles" key="Tier Miles" width="15%"
                                            render={(value, record) => (<span> {(value !== null) ? formatNumber(value) : '-'} </span>)} />
                                        <Column title="Frequency" dataIndex="frequency" key="Frequency" width="15%"
                                            render={(value, record) => (<span> {(value !== null) ? formatNumber(value) : '-'} </span>)} />
                                        <Column title="Expired Date" dataIndex="expireddate" key="Expired Date" width="15%"
                                            render={(value, record) => (<span> {(value) ? moment(value).format("DD/MM/YYYY") : '-'} </span>)} />
                                    </Table>
                                </Col>
                            </Row>
                        </Card>
                        {
                            (confirmtype === 'UPDATE') ?
                                <Card title="Extend Miles" bordered={false} style={{ marginBottom: 20 }} className="card-shadow">
                                    <Row gutter={24}>
                                        <Col className="gutter-row" span={16}>
                                            <DatePickerBase wrapperCol={{ span: 10 }} labelCol={{ span: 6 }} form={this.props.form} labeltext="Extension Date" datafield="extenddate" validationrules={['required', 'pattern.letterspace']} maxLength={45} minDate={moment()} disabled={true} />
                                        </Col>
                                        <Col className="gutter-row" span={24}>
                                            <Text type="danger"> * The extension's transaction will be carried out for members. Please ensure this process. </Text>
                                        </Col>
                                    </Row>
                                </Card>
                                : null
                        }
                        <Row gutter={24} type="flex" justify="center" style={{ marginTop: 30 }}>
                            {
                                (confirmtype === 'UPDATE') ?
                                    <Button htmlType="submit" type="primary" label="Yes & Reschedule" /> : null
                            }
                            <Button htmlType="button" type="default" label="Back" onClick={this.props.handleCloseModal} />
                        </Row>
                    </Form>
                </Spin>
            </React.Fragment>
        )
    }
}

export default Form.create()(App);