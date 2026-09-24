import React from 'react';
import { RetrieveRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import { Button, SearchForm, Alert } from '../../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Modal, Button as AntButton, Dropdown, Menu, Icon } from 'antd';
import TableBase from '../../../../components/Table/TableBase';
import moment from 'moment';
import TrxDetail from './Detail';
import { formatNumber } from '../../../../utilities/Helpers';

const { Title } = Typography;
const { confirm } = Modal;

const MemberTrxType = [
    { "label": "Spending", "value": "SPENDING" },
    { "label": "Spending Correction", "value": "SPENDING_CORRECTION" },
    { "label": "Cancellation", "value": "CANCELLATION" },
]

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: false,
            advancesearch: false,
            partnercode: this.props.location.state ? this.props.location.state.partnercode : null,
            partnername: this.props.location.state ? this.props.location.state.partnername : null
        };
    }

    componentDidMount() {
        document.title = "Manage Transaction | Loyalty Management System";
    }

    handleSearchForm = (criteria, criteriadataprevious) => {
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (err) return;
            const allFields = this.props.form.getFieldsValue();
            const trxdatestart = allFields.trxdatestart;
            const trxdateend = allFields.trxdateend;
            const partnertrxtypes = allFields.partnertrxtypes || allFields.partnertrxtypes2 || [];
            if (trxdatestart && !trxdateend) return;
            const criteriadata = (partnertrxtypes.length !== 0)
                ? { ...criteriadataprevious, partnertrxtypes }
                : { ...criteriadataprevious };
            this.componentTable.handleSearchForm(criteria, criteriadata);
            const searching = Object.keys(criteria).filter(key => criteria[key] !== null && criteria[key] !== undefined && criteria[key] !== '').length > 0;
            this.setState({ searching, criteria });
        });
    };

    handleOpenModal = (partnercode, partnertrxid) => {
        this.setState({ visible: true, partnercode, partnertrxid });
    }

    handleCancel = () => {
        this.setState({ visible: false });
    }

    handleReset = () => {
        this.props.form.resetFields();
    };

    handleDownloadModal = (type) => {
        const callback = () => {
            let url = type === "PDF" ? api.url.partnertransaction.pdf : api.url.partnertransaction.csv;
            let partnertrxtypes = this.props.form.getFieldValue('partnertrxtypes');
            let trxdatestart = this.props.form.getFieldValue("trxdatestart")?.format("YYYY-MM-DD");
            let trxdateend = this.props.form.getFieldValue("trxdateend")?.format("YYYY-MM-DD");
            let cardnumber = this.props.form.getFieldValue('cardnumber');
            let refcode = this.props.form.getFieldValue('refcode');
            let criteria = { trxdatestart, trxdateend, cardnumber, refcode, partnertrxtypes, partnercode: this.state.partnercode };
            let message = 'Downloading...';
            RetrieveRequest(url, criteria, {}, [], {}).then((response) => {
                const { responsecode, responsemessage } = response.status;
                const { result } = response;
                if (responsecode && responsecode === '0000') {
                    window.location.href = result.url;
                    if (responsemessage) Alert.success(message);
                    this.componentTable.handleSearchForm({ partnercode: this.state.partnercode, partnertrxtypes: null, trxdatestart: null, trxdateend: null, cardnumber: null, refcode: null });
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

    handleTrxDate = () => {
        this.props.form.resetFields(['trxdateend', []]);
    } 

    render() {
        const { visible, loading, partnercode, partnertrxid } = this.state;
        const trxdatestart = this.props.form.getFieldValue('trxdatestart');
        const configurationSearchForm = [
            { labeltext: "Transaction Date Start", datafield: "trxdatestart", type: 'datepicker', placeholder: 'Transaction Date Start', showDefaultSearch: true, onChange: (e) => this.handleTrxDate(e) },
            { labeltext: "Transaction Date End", datafield: "trxdateend", type: 'datepicker', placeholder: 'Transaction Date End', showDefaultSearch: true, validationrules: trxdatestart ? ['required'] : [], disabled: trxdatestart ? '' : true, minDate: moment(trxdatestart), },
            { labeltext: 'Transaction Type', datafield: 'partnertrxtypes', type: 'selectcheckbox', placeholder: 'Transaction Type', options: MemberTrxType, showDefaultSearch: true, specialSearch: true },
            { labeltext: "Card Number", datafield: "cardnumber", type: 'field', placeholder: 'Card Number', showDefaultSearch: false },
            { labeltext: "Ref Code", datafield: "refcode", type: 'field', placeholder: 'Ref Code', showDefaultSearch: false },
        ];
        const configurationTable = {
            url: api.url.partnertransaction.retrieve,
            criteria: { partnercode },
            sort: { trxdate: 'desc' },
            columns: [
                {
                    type: 'html', title: 'Transaction Date', dataIndex: 'trxdate', align: 'center', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Card Number', dataIndex: 'cardnumber', align: 'center',
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Member Name', dataIndex: 'membername',
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Partner Trx Type', dataIndex: 'partnertrxtype', align: 'center',
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Award Bulk Miles', dataIndex: 'bulkmiles', align: 'center', align: 'right',
                    render: (value) => { return (value) ? formatNumber(value) : '-' }
                },
                {
                    type: 'html', title: 'Regular Miles', dataIndex: 'regularmiles', align: 'center', align: 'right',
                    render: (value) => { return (value) ? formatNumber(value) : '-' }
                },
                {
                    type: 'html', title: 'Act Code', dataIndex: 'activitycode',
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Ref Code', dataIndex: 'refcode',
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Created Date', dataIndex: 'createdDate',
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Created By', dataIndex: 'createdBy',
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row) => {
                        return (
                            <span>
                                <Button htmlType="button" size="small" label="Detail" className="btn-custom-info" onClick={() => this.handleOpenModal(row.partnercode, row.partnertrxid)} />
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
                        <Title level={4}>Transaction</Title>
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
                    <Modal visible={visible} loading={loading} onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={1200}>
                        <TrxDetail partnercode={partnercode} partnertrxid={partnertrxid} onClose={this.handleCancel} />
                    </Modal>
                </Row>
                <SearchForm form={this.props.form} showAdvanceSearch={true} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export default Form.create()(App);