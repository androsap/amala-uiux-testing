import React from 'react';
import { api } from '../../config/Services';
import { Button, SearchForm, TableBase } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Modal } from 'antd';
import { jsUcfirst } from '../../utilities/Helpers';
import { getProfile } from '../../utilities/AuthService';
import moment from 'moment';
import FormVerify from './Form';

const { Title } = Typography;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            titlepage: 'Verify New'
        }
    }

    componentDidMount() {
        document.title = "Manage Voucher | Loyalty Management System";
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    handleOpenModal = (certificateid) => {
        this.setState({ certificateid, visible: true });
    }

    handleCancel = () => {
        this.setState({ visible: false, titlepage: 'Verify New' });
    };

    handleOk = () => {
        this.setState({ visible: false }, this.componentTable.getList());
    };

    setTitlePage = (titlepage) => {
        this.setState({ titlepage });
    }

    render() {
        const { menucode, prefixmenuname } = this.props;
        const { visible, titlepage, certificateid } = this.state;
        let partner = getProfile().partnercode;
        const configurationTable = {
            url: api.url.redemptioncertificate.list,
            criteria: { partner, status: 'VOUCHER_REDEEM' },
            sort: { redeemdate: 'desc' },
            columns: [
                {
                    type: 'field', title: 'Issued Date', dataIndex: 'issueddate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'field', title: 'Redeem Date', dataIndex: 'redeemdate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                { type: 'field', title: 'Certificate ID', dataIndex: 'certificateid', sorter: true },
                { type: 'field', title: 'Partner', dataIndex: 'partner', sorter: true },
                {
                    type: 'field', title: 'Status', dataIndex: 'status', sorter: true,
                    render: (value, row, index) => { return (value) ? jsUcfirst(value, "_") : '-' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button htmlType="button" size="small" icon="eye" title="View" onClick={() => this.handleOpenModal(row.certificateid)} />
                            </span>
                        )
                    }
                },
            ]
        };

        const configurationSearchForm = [
            { labeltext: "Issued Date", datafield: "issueddate", type: 'datepicker', placeholder: 'Issued Date', showDefaultSearch: true },
            { labeltext: "Redeem Date", datafield: "redeemdate", type: 'datepicker', placeholder: 'Redeem Date', showDefaultSearch: true },
            { labeltext: "Certificate ID", datafield: "certificateid", type: 'text', placeholder: 'Certificate ID', showDefaultSearch: true }
        ];

        return (
            <React.Fragment>
                <Modal title={titlepage + ' Voucher'} visible={visible} onCancel={this.handleCancel} destroyOnClose={true} footer={null} width={860}>
                    <FormVerify certificateid={certificateid} setTitlePage={this.setTitlePage} closemodalrefresh={this.handleOk} cancelModal={this.handleCancel} />
                </Modal>
                <Row>
                    <Col xs={24} xl={21}>
                        <Title level={3}>Manage Voucher</Title>
                    </Col>
                    <Col xs={24} xl={3}>
                        <Button htmlType="button" type="primary" size="default" label="Verify New Voucher" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" onClick={() => this.handleOpenModal()} />
                    </Col>
                    <Divider />
                </Row>
                <SearchForm form={this.props.form} showAdvanceSearch={false} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export default Form.create()(App);