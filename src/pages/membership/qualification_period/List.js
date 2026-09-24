import React from 'react';
import { DeleteRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { Alert, Button, TableBase, SearchForm } from '../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
import moment from 'moment';

const { Title } = Typography;

const optionsDuration = [
    { label: 'MONTH', value: 'MONTH' },
    { label: 'YEAR', value: 'YEAR' }
]

const optionsStatus = [
    { label: 'ACTIVE', value: true },
    { label: 'INACTIVE', value: false }
]

class App extends React.Component {
    componentDidMount() {
        document.title = "Manage Qualification (Upgrade Period) | Loyalty Management System";
    }

    handleSearchForm = (criteria, criteriadata) => {
        this.componentTable.handleSearchForm(criteria, criteriadata);
    }

    deleteData(qualificationid) {
        let url = api.url.membership.qualification.delete;
        let data = { qualificationid };
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

    handleChangePage(page, qualificationid = null) {
        this.props.changePage({ page, qualificationid });
    }

    render() {
        const { menucode, prefixmenuname, permission } = this.props;
        const { usermenu } = permission;

        const configurationSearchForm = [
            { labeltext: "Date", datafield: "date", type: 'datepicker', placeholder: 'Date', showDefaultSearch: true, specialSearch: true }
        ];

        const configurationTable = {
            url: api.url.membership.qualification.list,
            criteria: { membershipid: this.props.membershipid },
            columns: [
                { type: 'field', title: 'Duration Period', dataIndex: 'durationtype', sorter: true },
                {
                    type: 'field', title: 'Effective Date', dataIndex: 'effectivedate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                {
                    type: 'field', title: 'Discontinue Date', dataIndex: 'discontinuedate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button htmlType="button" size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" onClick={() => this.handleChangePage('form', row.qualificationid)} />
                                <Button htmlType="button" size="small" label="Delete" type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(row.qualificationid)} />
                            </span>
                        )
                    }
                },
            ]
        };

        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Manage Qualification (Upgrade Period)</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        {
                            (usermenu[menucode][prefixmenuname + '_UPDATE']) ?
                                <Button htmlType="button" type="primary" size="default" label="Add New" onClick={() => (this.handleChangePage('form'))} /> : null
                        }
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