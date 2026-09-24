import React from 'react';
import { api } from '../../config/Services';
import { Button, SearchForm } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
import { PricingByAward } from '../../data';
import moment from 'moment';
import TableBase from '../../components/Table/TableBase';

const { Title } = Typography;
const optionsStatus = [
    { label: 'NOTREADY', value: 'NOTREADY' },
    { label: 'ACTIVATED', value: 'ACTIVATED' },
    { label: 'EXPIRED', value: 'EXPIRED' },
    { label: 'TERMINATE', value: 'TERMINATE' }
];
const configurationSearchForm = [
    { labeltext: "Award Code", datafield: "awardcode", type: 'text', placeholder: 'Award Code', showDefaultSearch: true },
    { labeltext: "Award Type", datafield: "awardtypecode", type: 'text', placeholder: 'Award Type', showDefaultSearch: true },
    { labeltext: "Award Name", datafield: "name", type: 'text', placeholder: 'Award Name', showDefaultSearch: false },
    { labeltext: "Pricing By", datafield: "pricingby", type: 'select', placeholder: 'Pricing By', showDefaultSearch: true, options: PricingByAward },
    { labeltext: "Start Date", datafield: "startdate", type: 'datepicker', placeholder: 'Start Date', showDefaultSearch: false },
    { labeltext: "End Date", datafield: "enddate", type: 'datepicker', placeholder: 'End Date', showDefaultSearch: false },
    { labeltext: "Status", datafield: "awardstatus", type: 'select', placeholder: 'Status', showDefaultSearch: true, options: optionsStatus }
];

class App extends React.Component {
    componentDidMount() {
        document.title = "Manage Award | Loyalty Management System";
    } s

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    render() {
        const { menucode, prefixmenuname } = this.props;
        const configurationTable = {
            url: api.url.awardmaster.list,
            columns: [
                { type: 'field', title: 'Award Code', dataIndex: 'awardcode', sorter: true },
                { type: 'field', title: 'Award Type Code', dataIndex: 'awardtypecode', sorter: true },
                { type: 'field', title: 'Pricing By', dataIndex: 'pricingby', sorter: true },
                { type: 'field', title: 'Name', dataIndex: 'name', sorter: true },
                {
                    type: 'html', title: 'Start Date', dataIndex: 'startdate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'End Date', dataIndex: 'enddate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                { type: 'field', title: 'Status', dataIndex: 'awardstatus', sorter: true },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        //encodeURIComponent, handle for encode special char in awardcode
                        return (
                            <span>
                                <Button url={'/award-list/form/' + encodeURIComponent(row.awardcode)} size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
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
                        <Title level={3}>Manage Award</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={'/award-list/form/'} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
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