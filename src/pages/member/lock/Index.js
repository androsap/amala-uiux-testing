import React from 'react';
import { SaveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { Button, Alert, CheckboxBase, TextArea } from '../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Modal, Spin, Alert as AntdAlert, Icon } from 'antd';
import Lock from './Lock';
import History from './History';
import moment from 'moment';

const { Title, Text } = Typography;
const { confirm } = Modal;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            isLoading: false,
            formType: null
        }
    }

    componentDidMount() {
        document.title = "Lock Member | Loyalty Management System";
    }

    saveAction = (e) => {
        e.preventDefault();

        const { ID } = this.props.match.params;
        const { memberlock } = this.props;
        const { memberlockid, blockaccrual, blockredeem, blocktransfer, blockreceive, blockbuy, startdate, reason } = memberlock || {};

        const callback = () => {
            this.setState({ isLoading: true });
            //define parameter
            let memberid = ID;
            let enddate = moment(new Date());
            let active = false;

            let url = api.url.memberlock.update;
            let data = { memberid, memberlockid, blockaccrual, blockredeem, blocktransfer, blockreceive, blockbuy, startdate, enddate, reason, active };
            let message = 'Member has been unlocked';
            SaveRequest(url, data).then((response) => {
                const { responsecode, responsemessage } = response.status;
                if (responsecode.substring(0, 1) === '0') {
                    message = (responsemessage) ? responsemessage : message;
                    Alert.success(message);
                    this.props.getMemberLock();
                } else {
                    Alert.error(responsemessage);
                }
                //hide loader
                this.setState({ isLoading: false });
            })
        }

        confirm({
            title: 'Are you sure?',
            okText: 'Yes',
            cancelText: 'No',
            onOk(e) {
                return new Promise((resolve, reject) => {
                    setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                    callback();
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel() { },
        });
    };

    handleOpenModal = (memberid, formType) => {
        this.setState({ visible: true, memberid, formType });
    };


    handleCancel = () => {
        this.setState({ visible: false });
    };

    render() {
        const memberid = this.props.match.params.ID;
        const { visible, isLoading, formType } = this.state;
        const { form, menucode, prefixmenuname, getMemberLock, memberlock } = this.props;
        const { blockaccrual, blockredeem, blocktransfer, blockreceive, reason, startdate } = memberlock || {};

        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 10 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 11 } },
        };

        const titleBarModal = { locking: 'Lock Member', history: 'Lock History' };

        return (
            <React.Fragment>
                <Modal visible={visible} title={titleBarModal[formType]} loading={isLoading} onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={960}>
                    {
                        (formType === 'locking') ? <Lock memberid={memberid} onClose={this.handleCancel} getMemberLock={getMemberLock} /> :
                            (formType === 'history') ? <History memberid={memberid} /> : null
                    }
                </Modal>
                <Row>
                    <Col xs={24} xl={20}>
                        <Title level={4}>Lock</Title>
                    </Col>
                    <Col xs={24} xl={4} align="right">
                        <Button htmlType="button" type="primary" label="View History" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="ACCESS" onClick={() => this.handleOpenModal(memberid, 'history')} />
                    </Col>
                    <Divider />
                </Row>
                {
                    (memberlock) ?
                        <Row>
                            <Form {...formItemLayout} onSubmit={this.saveAction}>
                                <Spin spinning={isLoading}>
                                    <Row gutter={24}>
                                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 11, offset: 6 }} xl={{ span: 11, offset: 6 }}>
                                            <AntdAlert message={`Member locked since ${moment(startdate).format('DD MMM YYYY HH:mm:ss')}.`} type="error" style={{ marginBottom: 20 }} icon={<Icon type="lock" />} showIcon />
                                        </Col>
                                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 6, offset: 6 }} xl={{ span: 6, offset: 6 }}>
                                            <CheckboxBase form={form} datafield="blockaccrual" children="Not eligible for Accrual" initialvalue={blockaccrual} checked={blockaccrual} disabled />
                                        </Col>
                                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={8} xl={8}>
                                            <CheckboxBase form={form} datafield="blocktransfer" children="Not eligible for Transfer" initialvalue={blocktransfer} checked={blocktransfer} disabled />
                                        </Col>
                                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 6, offset: 6 }} xl={{ span: 6, offset: 6 }}>
                                            <CheckboxBase form={form} datafield="blockredeem" children="Not eligible for Redeem" initialvalue={blockredeem} checked={blockredeem} disabled />
                                        </Col>
                                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={8} xl={8}>
                                            <CheckboxBase form={form} datafield="blockreceive" children="Not eligible for Receive" initialvalue={blockreceive} disabled />
                                        </Col>
                                        <Col className="gutter-row" xs={24} sm={24} md={{ span: 19, offset: 0 }} lg={{ span: 19, offset: 0 }} xl={{ span: 19, offset: 0 }} style={{ marginTop: 12 }}>
                                            <TextArea form={form} datafield="reason" labeltext="Reason" defaultValue={reason} disabled />
                                        </Col>
                                    </Row>
                                </Spin>
                                <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                    <Button htmlType="submit" type="primary" label="End Locking" />
                                </Row>
                            </Form>
                        </Row> :
                        < Row >
                            <Col xs={24} xl={24} style={{ marginBottom: '10px' }}>
                                <Text>Lock member to limit their activities</Text>
                            </Col>
                            <Col xs={24} xl={24}>
                                <Button htmlType="button" type="primary" size="default" label="Lock Member" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" onClick={() => this.handleOpenModal(memberid, 'locking')} />
                            </Col>
                        </Row>
                }
            </React.Fragment>
        );
    }
}

export default Form.create()(App);