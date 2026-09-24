import React from 'react';
import { DeleteRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import { Button, SearchForm, Alert } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
import moment from 'moment';
import TableBase from '../../components/Table/TableBase';

const { Title } = Typography;

const configurationSearchForm = [
    { labeltext: "Relation Type", datafield: "relationtypename", type: 'text', placeholder: 'Relation Type', showDefaultSearch: true },
    { labeltext: "Bonus", datafield: "bonus", type: 'text', placeholder: 'Bonus', showDefaultSearch: true },
    { labeltext: "Custom Transaction", datafield: "customtrxname", type: 'text', placeholder: 'Custom Transaction', showDefaultSearch: false },
    { labeltext: "Active Period", datafield: "activeperiod", type: 'text', placeholder: 'Active Period', showDefaultSearch: true },
    { labeltext: "Start Date", datafield: "startdate", type: 'datepicker', placeholder: 'Start Date', showDefaultSearch: true },
    { labeltext: "End Date", datafield: "enddate", type: 'datepicker', placeholder: 'End Date', showDefaultSearch: true },
    // { labeltext: "Status", datafield: "active", type: 'select', placeholder: 'Status', options: [{ label: 'Active', value: true }, { label: 'Inactive', value: false }], showDefaultSearch: false },
];

class App extends React.Component {
    componentDidMount() {
        document.title = "Manage Relation Type | Loyalty Management System";
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    deleteData(relationtypecode) {
        let url = api.url.relationtype.delete;
        let data = { relationtypecode };
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

    render() {
        const { menucode, prefixmenuname } = this.props;
        const configurationTable = {
            url: api.url.relationtype.list,
            columns: [
                { type: 'field', title: 'Relation Type', dataIndex: 'relationtypename', sorter: true },
                { type: 'field', title: 'Bonus', dataIndex: 'bonus', sorter: true },
                { type: 'field', title: 'Custom Tansaction', dataIndex: 'customtrxname', sorter: true },
                { type: 'field', title: 'Active Period', dataIndex: 'activeperiod', sorter: true },
                {
                    type: 'html', title: 'Start Date', dataIndex: 'startdate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                {
                    type: 'html', title: 'End Date', dataIndex: 'enddate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                // {
                //     type: 'html', title: 'Status', dataIndex: 'active', sorter: true,
                //     render: (value, row, index) => { return ((value) ? 'Active' : 'Inactive') }
                // },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button url={'/relation-type/form/' + row.relationtypecode} size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                                <Button htmlType="button" size="small" label="Delete" type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(row.relationtypecode)} />
                            </span>
                        )
                    }
                },
            ]
        }

        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Manage Relation Type</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={'/relation-type/form/'} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
                    </Col>
                    <Divider />
                </Row>
                <SearchForm form={this.props.form} showAdvanceSearch={true} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export default Form.create()(App);