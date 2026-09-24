import React from 'react';
import { DeleteRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import { Alert, Button, SearchForm, TableBase } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
import moment from 'moment';
import { jsUcfirst } from '../../utilities/Helpers';
import { TypeMemberCriteria } from '../../data';

const { Title } = Typography;

class App extends React.Component {
    componentDidMount() {
        document.title = "Manage Mileage Criteria | Loyalty Management System";
    }

    deleteData(mileagecriteriaid) {
        let url = api.url.mileagecriteria.delete;
        let data = { mileagecriteriaid };
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
    }

    render() {
        const { menucode, prefixmenuname } = this.props;
        const configurationTable = {
            url: api.url.mileagecriteria.list,
            columns: [
                { type: 'field', title: 'Tier', dataIndex: 'tiername', sorter: true },
                { type: 'field', title: 'Membership', dataIndex: 'membershipname', sorter: true },
                { type: 'field', title: 'Membership Type', dataIndex: 'membershiptypename', sorter: true },
                { 
                    type: 'field', title: 'Type', dataIndex: 'type', sorter: true,
                    render: (value) => { return (value) ? jsUcfirst(value) : '' }
                },
                {
                    type: 'field', title: 'Effective Date', dataIndex: 'effectivedate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                {
                    type: 'field', title: 'Expired Date', dataIndex: 'expireddate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                {
                    type: 'group', title: 'Mileage', childcolumns: [
                        {
                            type: 'html', title: 'Min', dataIndex: 'minmileage', sorter: true,
                            render: (value, row, index) => { return (value !== undefined) ? value : '-' }
                        },
                        {
                            type: 'html', title: 'Max', dataIndex: 'maxmileage', sorter: true,
                            render: (value, row, index) => { return (value !== undefined) ? value : '-' }
                        }
                    ]
                },
                {
                    type: 'group', title: 'Frequency', childcolumns: [
                        {
                            type: 'html', title: 'Min', dataIndex: 'minfrequency', sorter: true,
                            render: (value, row, index) => { return (value !== undefined) ? value : '-' }
                        },
                        {
                            type: 'html', title: 'Max', dataIndex: 'maxfrequency', sorter: true,
                            render: (value, row, index) => { return (value !== undefined) ? value : '-' }
                        }
                    ]
                },
                {
                    type: 'group', title: 'Age', childcolumns: [
                        {
                            type: 'html', title: 'Min', dataIndex: 'minage', sorter: true,
                            render: (value, row, index) => { return (value !== undefined) ? value : '-' }
                        },
                        {
                            type: 'html', title: 'Max', dataIndex: 'maxage', sorter: true,
                            render: (value, row, index) => { return (value !== undefined) ? value : '-' }
                        }
                    ]
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button url={'/mileage-criteria/form/' + row.mileagecriteriaid} size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                                <Button htmlType="button" size="small" label="Delete" type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(row.mileagecriteriaid)} />
                            </span>
                        )
                    }
                },
            ]
        };

        const configurationSearchForm = [
            { labeltext: "Tier", datafield: "tiername", type: 'text', placeholder: 'Tier', showDefaultSearch: true },
            { labeltext: "Membership", datafield: "membershipname", type: 'text', placeholder: 'Membership', showDefaultSearch: true },
            { labeltext: "Membership Type", datafield: "membershiptypename", type: 'text', placeholder: 'Membership Type', showDefaultSearch: true },
            { labeltext: "Type", datafield: "type", type: 'select', placeholder: 'Type', showDefaultSearch: false, options: TypeMemberCriteria },
            { labeltext: "Effective Date", datafield: "effectivedate", type: 'datepicker', placeholder: 'Effective Date', showDefaultSearch: false },
            { labeltext: "Expired Date", datafield: "expireddate", type: 'datepicker', placeholder: 'Expired Date', showDefaultSearch: false },
            { labeltext: "Min Mileage", datafield: "minmileage", type: 'text', placeholder: 'Min Mileage', showDefaultSearch: false },
            { labeltext: "Max Mileage", datafield: "maxmileage", type: 'text', placeholder: 'Max Mileage', showDefaultSearch: false },
            { labeltext: "Min Frequency", datafield: "minfrequency", type: 'text', placeholder: 'Min Frequency', showDefaultSearch: false },
            { labeltext: "Max Frequency", datafield: "maxfrequency", type: 'text', placeholder: 'Max Frequency', showDefaultSearch: false },
            { labeltext: "Min Age", datafield: "minage", type: 'text', placeholder: 'Min Age', showDefaultSearch: false },
            { labeltext: "Max Age", datafield: "maxage", type: 'text', placeholder: 'Max Age', showDefaultSearch: false },
        ];
        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Manage Mileage Criteria</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={'/mileage-criteria/form/'} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
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