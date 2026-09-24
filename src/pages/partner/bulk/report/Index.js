import React from 'react';
import { RetrieveRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import { Button, SearchForm, Alert } from '../../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Modal, Button as AntButton, Dropdown, Menu, Icon } from 'antd';
import TableBase from '../../../../components/Table/TableBase';
import moment from 'moment';
import PartnerDetail from './Detail';
import { formatNumber } from '../../../../utilities/Helpers';

const { Title } = Typography;
const { confirm } = Modal;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: false,
            billingid: null,
            partnercode: this.props.location.state.partnercode ? this.props.location.state.partnercode : null,
            partnername: this.props.location.state.partnername ? this.props.location.state.partnername : null
        };
    }

    componentDidMount() {
        document.title = "Manage Partner Report | Loyalty Management System";
    }

    handleSearchForm = (criteria) => {
        criteria.createddate = (criteria.createddate) ? "%" + moment(criteria.createddate).format("YYYY-MM-DD") + "%" : null;
        this.componentTable.handleSearchForm(criteria);
    }

    handleOpenModal = (billingid) => {
        this.setState({ visible: true, billingid });
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };

    handleReset = () => {
        this.props.form.resetFields();
    };

    handleDownloadModal = (type) => {
        const callback = () => {
            let url = type === "PDF" ? api.url.partnerbilling.pdf : api.url.partnerbilling.csv;
            let createdby = this.props.form.getFieldValue('createdby');
            let createddate = this.props.form.getFieldValue("createddate")
                ? `%${this.props.form.getFieldValue("createddate").format("YYYY-MM-DD")}%`
                : null
            let criteria = { createddate, createdby, partnercode: this.state.partnercode };
            let message = 'Downloading...';
            RetrieveRequest(url, criteria, {}, [], {}).then((response) => {
                const { responsecode, responsemessage } = response.status;
                const { result } = response;
                if (responsecode && responsecode === '0000') {
                    window.location.href = result.url;
                    if (responsemessage) Alert.success(message);
                    this.componentTable.handleSearchForm({ partnercode: this.state.partnercode, createdby: null, createddate: null });
                    this.handleReset();
                } else {
                    Alert.error(responsemessage);
                }
            });
        }
        confirm({
            title: 'Are you sure to download this file?',
            onOk() {
                return new Promise((resolve, reject) => {
                    setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                    callback();
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel() { },
        });
    }

    render() {
        const { billingid, visible, loading, partnercode } = this.state;
        const configurationSearchForm = [
            { labeltext: "Created Date", datafield: "createddate", type: 'datepicker', placeholder: 'Created Date', showDefaultSearch: true },
            { labeltext: "Created By", datafield: "createdby", type: 'text', placeholder: 'Created By', showDefaultSearch: true },
        ];
        const configurationTable = {
            url: api.url.partnerbilling.retrieve,
            criteria: { partnercode },
            sort: {},
            columns: [
                {
                    type: 'html', title: 'Period Month', dataIndex: 'periodemonth', sorter: false,
                    render: (value) => {
                        return (value === 1) ? 'Januari' :
                            (value === 2) ? 'Februari' :
                                (value === 3) ? 'Maret' :
                                    (value === 4) ? 'April' :
                                        (value === 5) ? 'Mei' :
                                            (value === 6) ? 'Juni' :
                                                (value === 7) ? 'Juli' :
                                                    (value === 8) ? 'Agustus' :
                                                        (value === 9) ? 'September' :
                                                            (value === 10) ? 'Oktober' :
                                                                (value === 11) ? 'November' :
                                                                    (value === 12) ? 'Desember' : '-'
                    }
                },
                {
                    type: 'html', title: 'Period Year', dataIndex: 'periodeyear', sorter: false,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Bulk Miles Transaction Total', dataIndex: 'bulkmilestrxtotal', sorter: false, align: 'right',
                    render: (value) => { return (value) ? formatNumber(value) : '' }
                },
                {
                    type: 'html', title: 'Regular Miles Transaction Total', dataIndex: 'regularmilestrxtotal', sorter: false, align: 'right',
                    render: (value) => { return (value) ? formatNumber(value) : '' }
                },
                {
                    type: 'html', title: 'Created Date', dataIndex: 'createdDate', sorter: false,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Created By', dataIndex: 'createdBy', sorter: false,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row) => {
                        return (
                            <span>
                                <Button htmlType="button" size="small" label="Detail" className="btn-custom-info" onClick={() => this.handleOpenModal(row.billingid)} />
                            </span>
                        )
                    }
                }
            ]
        }

        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={20}>
                        <Title level={4}>Partner Report</Title>
                    </Col>
                    <Col xs={24} xl={4} align="right">
                        <Dropdown overlay={
                            <Menu>
                                <Menu.Item key="1">
                                    <Button htmlType="button" type="default" icon="download" label="PDF" onClick={() => this.handleDownloadModal('PDF')} />
                                </Menu.Item>
                                <Menu.Item key="2">
                                    <Button htmlType="button" type="default" icon="download" label="CSV" onClick={() => this.handleDownloadModal('CSV')} />
                                </Menu.Item>
                            </Menu>
                        }>
                            <AntButton type="default" size="default"> Download <Icon type="down" /></AntButton>
                        </Dropdown>
                    </Col>
                    <Divider />
                    <Modal visible={visible} title="Detail Partner Report" loading={loading} onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={1200}>
                        <PartnerDetail partnercode={partnercode} billingid={billingid} onClose={this.handleCancel} />
                    </Modal>
                </Row>
                <SearchForm form={this.props.form} showAdvanceSearch={false} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export default Form.create()(App);