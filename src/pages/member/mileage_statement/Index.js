
import React from 'react';
import { api } from '../../../config/Services';
import { RetrieveRequest } from '../../../utilities/RequestService';
import { Button, Alert } from '../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Modal, Spin } from 'antd';
import TableBase from '../../../components/Table/TableBase';

const { Title } = Typography;
const { confirm } = Modal;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            criteria: {},
            visible: false,
        }
        this.componentTable = [];
    }

    componentDidMount() {
        document.title = "Member Mileage Statement | Loyalty Management System";
    };

    handleDownloadModal = (mileagestatementid) => {
        const callback = () => {
            let url = api.url.mileagestatementmember.download;
            let criteria = { mileagestatementid };
            let message = 'Downloading Member file...';
            RetrieveRequest(url, criteria, {}, [], {}).then((response) => {
                const { responsecode, responsemessage } = response.status;
                if (responsecode && responsecode.substring(0, 1) === '0') {
                    window.location.href = response.result.url;
                    message = (responsemessage) ? responsemessage : message;
                    Alert.success(message);
                } else {
                    Alert.error(responsemessage);
                }
            });
        }

        confirm({
            title: 'Are you sure to download this report file?',
            onOk(e) {
                return new Promise((resolve, reject) => {
                    setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                    callback();
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel() { },
        });
    };

    render() {
        const { menucode, prefixmenuname } = this.props;
        const { isLoading } = this.state;
        const memberid = this.props.match.params.ID;
        const configurationTable = {
            url: api.url.mileagestatementmember.list,
            criteria: { memberid },
            sort: { createddate: 'desc' },
            columns: [
                {
                    type: 'field', title: 'Period Year', dataIndex: 'periodeyear', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Periode Month', dataIndex: 'periodemonth', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Filename', dataIndex: 'filename', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button url={this.props.match.url + '/detail/' + row.mileagestatementid} size="small" dataIndex="mileagestatementid" label="View" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="ACCESS" />
                                <Button htmlType="button" type="primary" size="small" icon="download" label="Download" dataIndex="mileagestatementid" onClick={() => this.handleDownloadModal(row.mileagestatementid)} />
                            </span>
                        )
                    }
                },
            ]
        }
        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={20}>
                        <Title level={4}>Member Mileage Statement</Title>
                    </Col>
                    <Divider />
                </Row>
                <Spin spinning={isLoading}>
                    <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
                </Spin>
            </React.Fragment>
        );
    }
}
export default Form.create()(App);
