import React from 'react';
import { api } from '../../config/Services';
import { Button, SearchForm, TableBase } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Modal } from 'antd';
import moment from 'moment';
import PreviewMember from './Detail';

const { Title } = Typography;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            isLoading: false,
            mergeid: null,
            mastermember: null,
            mergewith: null,
            requestnotes: null
        }
    }

    componentDidMount() {
        document.title = "Manage Merge Account Log | Loyalty Management System";
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    handleOpenModal = (mergeid, mastermember, mergewith, requestnotes, detailofrequest, status, cardnumbermergewith, cardnumbermastermember) => {
        this.setState({ visible: true, mergeid, mastermember, mergewith, requestnotes, detailofrequest, status, cardnumbermergewith, cardnumbermastermember });
    };

    handleCancel = () => {
        this.setState({ visible: false, titlepage: 'Create' });
    };

    handleOk = () => {
        this.setState({ showAddModal: false }, () => this.componentTable.getList());
    };

    render() {
        const { menucode, prefixmenuname } = this.props;
        const { visible, isLoading, mergeid, mastermember, mergewith, requestnotes, detailofrequest, status, cardnumbermergewith, cardnumbermastermember, } = this.state;
        const configurationTable = {
            url: api.url.profileintegration.retrieve,
            sort: { createdDate: 'desc' },
            columns: [
                { type: 'field', title: 'Card Number Origin', dataIndex: 'cardnumbermastermember', sorter: true },
                { type: 'field', title: 'Member Name Origin', dataIndex: 'mastername', sorter: true },
                { type: 'field', title: 'Card Number Destination', dataIndex: 'cardnumbermergewith', sorter: true },
                { type: 'field', title: 'Member Name Destination', dataIndex: 'mergewithname', sorter: true },
                {
                    type: 'html', title: 'Requested Date', dataIndex: 'createdDate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format("DD/MM/YYYY") : "-" }
                },
                // {
                //     type: 'html', title: 'Requested By', dataIndex: 'createdBy', sorter: true,
                //     render: (value) => { return (value) ? value : "-" }
                // },
                // {
                //     type: 'html', title: 'Canceled Date', dataIndex: 'cancelleddate', sorter: true,
                //     render: (value) => { return (value) ? moment(value).format("DD/MM/YYYY") : "-" }
                // },
                // {
                //     type: 'html', title: 'Canceled By', dataIndex: 'cancelledby', sorter: true,
                //     render: (value) => { return (value) ? value : "-" }
                // },
                {
                    type: 'html', title: 'Updated Date', dataIndex: 'updatedDate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format("DD/MM/YYYY") : "-" }
                },
                // {
                //     type: 'html', title: 'Updated By', dataIndex: 'updatedBy', sorter: true,
                //     render: (value) => { return (value) ? value : "-" }
                // },
                {
                    type: 'html', title: 'Status', dataIndex: 'status', sorter: true,
                    render: (value) => { return (value) ? value.replace(/_/g, " ") : "-" }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button url={this.props.match.url + '/detail/' + row.mergeid} size="small" title="Detail" icon="eye" actioncode="ACCESS" />
                            </span>
                        )
                    }
                },
            ]
        };

        const configurationSearchForm = [
            { labeltext: "Card Number Origin", datafield: "cardnumbermastermember", type: 'text', placeholder: 'Card Number Origin', showDefaultSearch: true },
            { labeltext: "Card Number Destination", datafield: "cardnumbermergewith", type: 'text', placeholder: 'Card Number Destination', showDefaultSearch: true },
        ];
        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Manage Merge Account Log</Title>
                    </Col>
                    <Divider />
                </Row>
                <Modal visible={visible} loading={isLoading} onCancel={this.handleCancel} footer={null} destroyOnClose={true} style={{ top: 10, bottom: 20 }} width={1200}>
                    <PreviewMember {...this.props} onClose={this.handleCancel} mergeid={mergeid} mastermember={mastermember} mergewith={mergewith} cardnumbermastermember={cardnumbermastermember} cardnumbermergewith={cardnumbermergewith} requestnotes={requestnotes} detailofrequest={detailofrequest} status={status} refreshList={this.handleOk} />
                </Modal>
                <SearchForm form={this.props.form} showAdvanceSearch={false} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export default Form.create()(App);