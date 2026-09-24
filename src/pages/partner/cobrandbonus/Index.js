import React from 'react';
import { api } from '../../../config/Services';
import { Button, TableBase, SearchForm } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Modal } from 'antd';
import CobrandBonusForm from './Form';
import moment from 'moment';

const prefixmenuname = 'COBBONUS';
const menucode = 'COBBONUS';

const optionsStatus = [
    { label: 'Active', value: true },
    { label: 'Inactive', value: false }
]

class App extends React.Component {
    state = {
        showAddModal: false,
        titlepage: 'Create'
    }

    componentDidMount() {
        this.componentTable.getList();
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    };

    handleOpenModal = (cobrandbonuscode) => {
        this.setState({ showAddModal: true, cobrandbonuscode });
    }

    handleOk = () => {
        this.setState({ showAddModal: false }, () => this.componentTable.getList());
    };

    handleCancel = () => {
        this.setState({ showAddModal: false, titlepage: 'Create' });
    };

    setTitlePage = (titlepage) => {
        this.setState({ titlepage });
    }

    render() {
        const { showAddModal, titlepage } = this.state;
        const configurationSearchForm = [
            { labeltext: "Bonus Type", datafield: "bonustype", type: 'text', placeholder: 'Bonus Type', showDefaultSearch: true },
            { labeltext: "Activity Code", datafield: "activitycode", type: 'text', placeholder: 'Activity Code', showDefaultSearch: true },
            { labeltext: "Effective Date", datafield: "effectivedate", type: 'datepicker', placeholder: 'Effective Date', showDefaultSearch: true },
            { labeltext: "Discontinue Date", datafield: "discontinuedate", type: 'datepicker', placeholder: 'Discontinue Date', showDefaultSearch: true },
            { labeltext: "Status", datafield: "active", type: 'select', placeholder: 'Status', showDefaultSearch: true, options: optionsStatus }
        ];
        const configurationTable = {
            url: api.url.cobrandbonus.list,
            criteria: { cobrandcode: this.props.cobrandcode },
            columns: [
                { type: 'field', title: 'Bonus Type', dataIndex: 'bonustype', sorter: true },
                { type: 'field', title: 'Bonus Miles', dataIndex: 'awardmiles', sorter: true },
                {
                    type: 'field', title: 'Activity Code', dataIndex: 'activitycode', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Custom Transaction', dataIndex: 'customtrxcode', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Effective Date', dataIndex: 'effectivedate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                {
                    type: 'html', title: 'Discontinue Date', dataIndex: 'discontinuedate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                {
                    type: 'html', title: 'Status', dataIndex: 'active', sorter: true,
                    render: (value) => { return (value) ? 'Active' : 'Inactive' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (_value, row) => {
                        return (
                            <span>
                                <Button htmlType="button" size="small" label={(this.props.activepartner && this.props.activecobrand) ? 'Edit' : 'View'} type="default" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" onClick={() => this.handleOpenModal(row.cobrandbonuscode)} />
                            </span>
                        )
                    }
                },
            ]
        };

        return (
            <React.Fragment>
                <Modal visible={showAddModal} title={titlepage + " Cobrand Bonus"} onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={700}>
                    <CobrandBonusForm cobrandcode={this.props.cobrandcode} partnercode={this.props.partnercode} cobrandbonuscode={this.state.cobrandbonuscode} activecobrand={this.props.activecobrand} activepartner={this.props.activepartner} setTitlePage={this.setTitlePage} closemodalrefresh={this.handleOk} />
                </Modal>
                <Row>
                    <Col xs={24} xl={24} align="right" style={{ marginBottom: 15 }}>
                        {
                            (this.props.activepartner && this.props.activecobrand) ? <Button type="primary" size="default" label="Add New" htmlType="button" onClick={() => this.handleOpenModal()} menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" /> : ''
                        }
                    </Col>
                </Row>
                <SearchForm form={this.props.form} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export default Form.create()(App);
