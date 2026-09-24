import React from 'react';
import { DeleteRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { connect } from "react-redux";
import { Alert, Button, TableBase, SearchForm } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Modal } from 'antd';
import moment from 'moment';
import FastTrackForm from './Form';

const prefixmenuname = 'FTRACK';
const menucode = 'FTRACK';

const optionsStatus = [
    { label: 'Active', value: 'true' },
    { label: 'Inactive', value: 'false' }
];

class App extends React.Component {
    state = {
        visible: false,
        titlepage: 'Create'
    }

    componentDidMount() {
        document.title = "Manage Fast Track Upgrade | Loyalty Management System";
    }

    deleteData(fasttrackupgradecode) {
        let url = api.url.cobrandfasttrack.delete;
        let data = { fasttrackupgradecode };
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode.substring(0, 1) === '0') {
                let message = (responsemessage) ? responsemessage : 'Selected data has been deleted';
                Alert.success(message);
            } else {
                Alert.error(responsemessage);
            }
            this.componentTable.getList();
        };

        DeleteRequest(url, data, callback);
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    };

    handleOpenModal = (fasttrackupgradecode) => {
        this.setState({ visible: true, fasttrackupgradecode });
    }

    handleOk = () => {
        this.setState({ visible: false }, () => this.componentTable.getList());
    };

    handleCancel = () => {
        this.setState({ visible: false, titlepage: 'Create' });
    };

    setTitlePage = (titlepage) => {
        this.setState({ titlepage });
    }

    render() {
        const { cobrandcode } = this.props;
        const { visible, titlepage, fasttrackupgradecode } = this.state;
        const configurationSearchForm = [
            { labeltext: "Tier Current", datafield: "tiercurrent", type: 'text', placeholder: 'Tier Current', showDefaultSearch: true },
            { labeltext: "Tier Upgrade", datafield: "tierupgrade", type: 'text', placeholder: 'Tier Upgrade', showDefaultSearch: true },
            { labeltext: "Min. Earned Miles", datafield: "minimumearnedmiles", type: 'text', placeholder: 'Min. Earned Miles', showDefaultSearch: false },
            { labeltext: "Duration", datafield: "duration", type: 'text', placeholder: 'Duration', showDefaultSearch: false },
            { labeltext: "Period", datafield: "period", type: 'text', placeholder: 'Period', showDefaultSearch: false },
            { labeltext: "Start Date", datafield: "startdate", type: 'datepicker', placeholder: 'Start Date', showDefaultSearch: false },
            { labeltext: "End Date", datafield: "enddate", type: 'datepicker', placeholder: 'End Date', showDefaultSearch: false },
            { labeltext: "Status", datafield: "active", type: 'select', placeholder: 'Status', showDefaultSearch: true, options: optionsStatus },
        ];
        const configurationTable = {
            url: api.url.cobrandfasttrack.list,
            criteria: { cobrandcode },
            columns: [
                { type: 'field', title: 'Tier Current', dataIndex: 'tiercurrent', sorter: true },
                { type: 'field', title: 'Tier Upgrade', dataIndex: 'tierupgrade', sorter: true },
                { type: 'field', title: 'Min. Earned Miles', dataIndex: 'minimumearnedmiles', sorter: true },
                { type: 'field', title: 'Duration', dataIndex: 'duration', sorter: true },
                { type: 'field', title: 'Period', dataIndex: 'period', sorter: true },
                {
                    type: 'html', title: 'Start Date', dataIndex: 'startdate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'End Date', dataIndex: 'enddate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'field', title: 'Status', dataIndex: 'active', sorter: true,
                    render: (value) => { return (value) ? 'Active' : 'Inactive' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action', width: '12%',
                    render: (_value, row) => {
                        return (
                            <span>
                                <Button htmlType="button" size="small" label={(this.props.activepartner && this.props.activecobrand) ? 'Edit' : 'View'} onClick={() => this.handleOpenModal(row.fasttrackupgradecode)} menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                                {
                                    (this.props.activepartner && this.props.activecobrand) ? <Button htmlType="button" size="small" label="Delete" type="danger" onClick={() => this.deleteData(row.fasttrackupgradecode)} menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" /> : ''
                                }
                            </span>
                        )
                    }
                },
            ]
        };

        return (
            <React.Fragment>
                <Modal visible={visible} title={titlepage + " Fast Track Upgrade"} onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={700}>
                    <FastTrackForm cobrandcode={this.props.cobrandcode} fasttrackupgradecode={fasttrackupgradecode} activecobrand={this.props.activecobrand} activepartner={this.props.activepartner} setTitlePage={this.setTitlePage} closemodalrefresh={this.handleOk} />
                </Modal>
                <Row>
                    <Col xs={24} xl={24} align="right" style={{ marginBottom: 15 }}>
                        {
                            (this.props.activepartner && this.props.activecobrand) ? <Button htmlType="button" type="primary" size="default" label="Add New" url={{ state: { cobrandcode: this.props.cobrandcode } }} onClick={() => this.handleOpenModal()} menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" /> : ''
                        }
                    </Col>
                </Row>
                <SearchForm form={this.props.form} showAdvanceSearch={true} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

// export default Form.create()(App);
const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));