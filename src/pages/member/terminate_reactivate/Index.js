import React from 'react';
import { RetrieveRequest, DetailRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { Button, Alert } from '../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Modal } from 'antd';
import FormNotes from './Form';

const { Title, Text } = Typography;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            status: null,
            result: {},
            resultGenConfig: null
        }
    }

    componentDidMount() {
        document.title = "Terminate / Reactivate | Loyalty Management System";
        this.getDetail();
        this.getConfig();
    }

    getDetail = () => {
        let url = api.url.member.profile;
        let data = { memberid: this.props.match.params.ID, type: 'ALL' };
        //call loader
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            let { status = {}, result } = response;
            if (status.responsecode === '0000') {
                this.setState({ result })
            } else {
                Alert.error(status.responsemessage);
            }
            this.setState({ isLoading: false });
        });
    }

    getConfig = () => {
        let url = api.url.generalconfig.list;
        let criteria = { key: "terminate.memberstatus" };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            let { status = {}, result } = response;
            if (status.responsecode === '0000') {
                let GenConfig = result[0].value.split(',')
                let resultGenConfig = GenConfig.map(function(value) {
                    return {status: value};
                  });
                this.setState({ resultGenConfig })
            } else {
                Alert.error(status.responsemessage);
            }
            this.setState({ isLoading: false });
        });
    }

    handleOpenModal = (memberid, status) => {
        this.setState({ memberid, visible: true, status })
    }

    handleCancel = () => {
        this.setState({ visible: false, });
    };

    handleOk = e => {
        this.setState({ visible: false });
    };

    refreshList = () => {
        this.getDetail();
    }

    render() {
        const { menucode, prefixmenuname } = this.props;
        const { result, resultGenConfig, visible, status } = this.state;
        const memberid = this.props.match.params.ID;
        const terminate = (Object.keys(result).length !== 0 && resultGenConfig !== null) ? resultGenConfig.find(obj => obj.status === `${result.status}`) : null;

        return (
            <React.Fragment>
                <Modal title={'Create Notes'} visible={visible} onCancel={this.handleCancel} destroyOnClose={true} footer={null} width={700}>
                    <FormNotes memberid={memberid} closemodalrefresh={this.handleOk} cancelModal={this.handleCancel} status={status} refreshHeader={this.props.refreshHeader} refreshList={this.refreshList} />
                </Modal>
                <Row>
                    <Col xs={24} xl={24}>
                        <Title level={4}>Terminate / Reactivate</Title>
                    </Col>
                    <Divider />
                    <Col xs={24} xl={24} style={{ marginBottom: '10px' }}>
                        {
                            (terminate !== undefined) ?
                                <Text>Click to terminate member</Text> :
                                (result.status === "TERMINATED") ?
                                    <Text>Click to reactivate member</Text> :
                                    <Text>This member can not be Terminated or Reactivated</Text>
                        }
                    </Col>
                    <Col xs={24} xl={24}>
                        {
                            (terminate !== undefined) ?
                                <Button htmlType="button" type="danger" size="default" label="Terminate Member" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="ACCESS" onClick={() => this.handleOpenModal(memberid)} />
                                :
                                (result.status === "TERMINATED") ?
                                    <Button htmlType="button" type="primary" size="default" label="Reactivate Member" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="ACCESS" onClick={() => this.handleOpenModal(memberid)} />
                                    :
                                    ""
                        }
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

export default Form.create()(App);