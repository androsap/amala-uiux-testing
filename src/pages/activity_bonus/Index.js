import React from 'react';
import { DeleteRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import { Alert, Button, SearchForm } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
import moment from 'moment';
import TableBase from '../../components/Table/TableBase';

const { Title } = Typography;
const configurationSearchForm = [
    { labeltext: "Program", datafield: "programcode", type: 'text', placeholder: 'Program', showDefaultSearch: false },
    { labeltext: "Membership", datafield: "membershipname", type: 'text', placeholder: 'Membership', showDefaultSearch: false },
    { labeltext: "Tier", datafield: "tiername", type: 'text', placeholder: 'Tier', showDefaultSearch: true },
    { labeltext: "Operating Airline", datafield: "operatingairline", type: 'text', placeholder: 'Operating Airline', showDefaultSearch: true },
    { labeltext: "Marketing Airline", datafield: "marketingairline", type: 'text', placeholder: 'Marketing Airline', showDefaultSearch: true },
    { labeltext: "Subclass", datafield: "subclasscode", type: 'text', placeholder: 'Subclass', showDefaultSearch: true },
    { labeltext: "Factor", datafield: "factor", type: 'text', placeholder: 'Factor', showDefaultSearch: false },
    { labeltext: "Effective Date", datafield: "effectivedate", type: 'datepicker', placeholder: 'Effective Date', showDefaultSearch: false },
    { labeltext: "Discontinue Date", datafield: "discontinuedate", type: 'datepicker', placeholder: 'Discontinue Date', showDefaultSearch: false }
];

class App extends React.Component {
    componentDidMount() {
        document.title = "Manage Activity Bonus | Loyalty Management System";
    }

    deleteData(tieractivitybonusid) {
        let url = api.url.activitybonus.delete;
        let data = { tieractivitybonusid };
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
            url: api.url.activitybonus.list,
            columns: [
                { type: 'field', title: 'Program', dataIndex: 'programcode', sorter: true, align: 'center' },
                { type: 'field', title: 'Membership', dataIndex: 'membershipname', sorter: true, align: 'center' },
                { type: 'field', title: 'Tier', dataIndex: 'tiername', sorter: true, align: 'center' },
                { type: 'field', title: <span>Marketing<br />Airline</span>, dataIndex: 'marketingairline', sorter: true, align: 'center' },
                { type: 'field', title: <span>Operating<br />Airline</span>, dataIndex: 'operatingairline', sorter: true, align: 'center' },
                { type: 'field', title: 'Subclass', dataIndex: 'subclasscode', sorter: true, align: 'center' },
                { type: 'field', title: 'Factor', dataIndex: 'factor', sorter: true, align: 'center' },
                {
                    type: 'html', title: 'Valid For', dataIndex: 'validfor', align: 'center',
                    render: (value, row, index) => {
                        let effectivedate = (row.effectivedate) ? moment(row.effectivedate).format('DD/MM/YYYY') : '';
                        let discontinuedate = (row.discontinuedate) ? moment(row.discontinuedate).format('DD/MM/YYYY') : '';
                        return effectivedate + ' - ' + discontinuedate;
                    }
                },
                // {
                //     type: 'html', title: 'Effective Date', dataIndex: 'effectivedate', sorter: true,
                //     render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                // },
                // {
                //     type: 'html', title: 'Discontinue Date', dataIndex: 'discontinuedate', sorter: true,
                //     render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                // },
                {
                    type: 'html', title: 'Action', dataIndex: 'action', width: "150px",
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button url={'/activity-bonus/form/' + row.tieractivitybonusid} size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                                <Button htmlType="button" size="small" label="Delete" type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(row.tieractivitybonusid)} />
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
                        <Title level={3}>Manage Activity Bonus</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={'/activity-bonus/form/'} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
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