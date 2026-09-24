import React from 'react';
import { SaveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { Button, Alert } from '../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Modal } from 'antd';
import Result from './Result';

const { Title, Text } = Typography;
const { confirm } = Modal;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            newpassword: null
        }
    }

    componentDidMount() {
        document.title = "Reset Password | Loyalty Management System";
    }

    handleOpenModal = () => {
        const callback = (resolve, reject) => {
            const { username } = this.props.profile;
            let data = { username };
            let url = api.url.activation.resetpassword;
            let message = 'Link Reset Password successfully sent';
            SaveRequest(url, data).then((response) => {
                const { responsecode, responsemessage } = response.status;
                if (responsecode.substring(0, 1) === '0') {
                    message = (responsemessage) ? responsemessage : message;
                    Alert.success(message);
                    resolve();
                } else {
                    reject();
                    Alert.error(responsemessage);
                }
            })
        }
        confirm({
            title: 'Are you sure to reset the password?',
            okText: 'Yes',
            cancelText: 'No',
            onOk(e) {
                return new Promise((resolve, reject) => {
                    // setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                    callback(resolve, reject);
                });
            },
            onCancel() { }
        });
    };

    handleCancel = () => {
        this.setState({ visible: false, });
    };

    generatePassword = (length) => {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    render() {
        const { menucode, prefixmenuname } = this.props;
        const { newpassword } = this.state;
        const memberid = this.props.match.params.ID;
        
        return (
            <React.Fragment>
                <Modal visible={this.state.visible} title="Reset Password" onCancel={this.handleCancel} footer={null} destroyOnClose={true}>
                    <Result memberid={memberid} newpassword={newpassword} onClose={this.handleCancel} />
                </Modal>
                <Row>
                    <Col xs={24} xl={24}>
                        <Title level={4}>Reset Password</Title>
                    </Col>
                    <Divider />
                    <Col xs={24} xl={24} style={{ marginBottom: '10px' }}>
                        <Text>Email will be sent to valid email member</Text>
                    </Col>
                    <Col xs={24} xl={24}>
                        <Button htmlType="button" type="primary" size="default" label="Reset Member Password" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="ACCESS" onClick={() => this.handleOpenModal(memberid)} />
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

export default Form.create()(App);